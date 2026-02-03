import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Record } from "src/common/entities/record.entity";
import { RecordSignature } from "src/common/entities/record_signature.entity";
import { User } from "src/common/entities/user.entity";
import { SignatureStatus } from "src/common/enums/signature_status.enum";
import { decrypt } from "src/common/helpers/encryption.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { DataSource } from "typeorm";

@Injectable()
export class SignerService {
  constructor(
    private dataSource: DataSource,
    private readonly blockchainService: BlockChainService,
  ) {}

  async signRecord(recordId: string, signerId: string) {
    // REPO SHORTCUTS (No transaction yet)
    const recordRepo = this.dataSource.getRepository(Record);
    const signatureRepo = this.dataSource.getRepository(RecordSignature);
    const userRepo = this.dataSource.getRepository(User);

    // ---------------------------------------------------------
    // STEP 1: PRE-CHECKS (Read-Only)
    // ---------------------------------------------------------

    // Fetch Record with relations
    const record = await recordRepo.findOne({
      where: { id: recordId },
      relations: [
        "credentialType",
        "credentialType.signers",
        "signatures",
        "signatures.signer",
      ],
    });

    if (!record) throw new NotFoundException("Record not found");

    // Authorization Check
    const isAuthorized = record.credentialType.signers.some(
      (authorizedUser) => authorizedUser.id === signerId,
    );
    if (!isAuthorized) {
      throw new ForbiddenException(
        "You are not authorized to sign this credential type.",
      );
    }

    // Duplication Check
    const existingSignature = record.signatures.find(
      (sig) => sig.signer.id === signerId,
    );

    if (existingSignature) {
      // If previous attempt failed, we might allow retry, otherwise block
      if (
        existingSignature.status === SignatureStatus.CONFIRMED ||
        existingSignature.status === SignatureStatus.SUBMITTED
      ) {
        throw new BadRequestException(
          "You have already signed (or have a pending transaction for) this record.",
        );
      }
      // If status is FAILED, we can proceed to retry (logic falls through)
    }

    // ---------------------------------------------------------
    // STEP 2: PREPARE DATA (Private Key)
    // ---------------------------------------------------------

    // Fetch user WITH private key (explicitly selected because select: false in entity)
    const signerUser = await userRepo
      .createQueryBuilder("user")
      .addSelect("user.privateKey")
      .where("user.id = :id", { id: signerId })
      .getOne();

    if (!signerUser || !signerUser.privateKey) {
      throw new BadRequestException(
        "Signer setup incomplete (missing wallet).",
      );
    }

    const decryptedKey = await decrypt(signerUser.privateKey);

    // ---------------------------------------------------------
    // STEP 3: SAVE INTENT (Status: PENDING)
    // ---------------------------------------------------------
    // We save this BEFORE the blockchain call. If the app crashes, we know we tried.

    let signature = existingSignature
      ? existingSignature // Reuse existing row if retrying a failed attempt
      : new RecordSignature();

    signature.record = record;
    signature.signer = signerUser; // We can use the object
    signature.status = SignatureStatus.PENDING;
    signature.txHash = null; // Clear any old hash if retrying

    // Save to DB immediately (No transaction lock here)
    signature = await signatureRepo.save(signature);

    try {
      // ---------------------------------------------------------
      // STEP 4: BLOCKCHAIN EXECUTION (The Risky Part)
      // ---------------------------------------------------------

      // Call your blockchain service.
      // Ensure this method returns the Transaction Response (containing .hash and .wait())
      const txResponse = await this.blockchainService.signRecord(
        record.credentialRef,
        decryptedKey,
      ); // Assuming this is your smart contract method

      // IMMEDIATE UPDATE: We have the hash!
      signature.txHash = txResponse.hash;
      signature.status = SignatureStatus.SUBMITTED;
      await signatureRepo.save(signature);

      // ---------------------------------------------------------
      // STEP 5: WAIT FOR CONFIRMATION
      // ---------------------------------------------------------
      // This pauses the thread until the block is mined (approx 2-5s on Polygon/Base, 15s on Eth)
      const receipt = await txResponse.wait();

      if (receipt.status !== 1) {
        throw new Error("Transaction reverted by EVM");
      }

      // ---------------------------------------------------------
      // STEP 6: FINAL ATOMIC UPDATE (Status + Count)
      // ---------------------------------------------------------
      // NOW we use a transaction because we need to update two tables safely

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Update Signature Status
        signature.status = SignatureStatus.CONFIRMED;
        await queryRunner.manager.save(RecordSignature, signature);

        // Update Record Count
        // We increment directly in DB to avoid race conditions with other signers
        await queryRunner.manager.increment(
          Record,
          { id: recordId },
          "currentSignatures",
          1,
        );

        await queryRunner.commitTransaction();
      } catch (dbError) {
        // IF THIS FAILS: The blockchain succeeded, but DB update failed.
        // Status remains "SUBMITTED" in DB.
        // We log it critical. A cron job can fix this later.
        console.error(
          "CRITICAL: Blockchain confirmed but DB update failed",
          dbError,
        );
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(
          "Signature confirmed on-chain but DB update failed. Please contact support.",
        );
      } finally {
        await queryRunner.release();
      }

      return signature;
    } catch (error) {
      // ---------------------------------------------------------
      // STEP 7: ERROR HANDLING
      // ---------------------------------------------------------
      console.error("Signing Error:", error);

      // Mark as FAILED so user can retry
      signature.status = SignatureStatus.FAILED;
      await signatureRepo.save(signature);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new BadRequestException(
        "Blockchain transaction failed: " + (error.message || "Unknown error"),
      );
    }
  }
}
