import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Sign } from "crypto";
import { first } from "rxjs";
import { Record } from "src/common/entities/record.entity";
import { RecordSignature } from "src/common/entities/record_signature.entity";
import { User } from "src/common/entities/user.entity";
import { SignatureStatus } from "src/common/enums/signature_status.enum";
import { SigningResultStatus } from "src/common/enums/signing_result_status";

import { decrypt } from "src/common/helpers/encryption.helper";
import { RejectedSigningResponse } from "src/common/types/rejected_signing_response";
import { SuccessSigningResponse } from "src/common/types/success_signing_response";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { DataSource, In } from "typeorm";

@Injectable()
export class SignerService {
  constructor(
    private dataSource: DataSource,
    private readonly blockchainService: BlockChainService,
  ) {}

  async batchSignRecords(
    recordIds: string[],
    signerId: string,
  ): Promise<SuccessSigningResponse | RejectedSigningResponse> {
    const recordRepo = this.dataSource.getRepository(Record);
    const signatureRepo = this.dataSource.getRepository(RecordSignature);
    const userRepo = this.dataSource.getRepository(User);

    // ---------------------------------------------------------
    // STEP 1: FETCH DATA (Bulk Read)
    // ---------------------------------------------------------
    const records = await recordRepo.find({
      where: { id: In(recordIds) },
      relations: [
        "credentialType",
        "credentialType.signers",
        "signatures",
        "signatures.signer",
      ],
    });

    const signerUser = await userRepo
      .createQueryBuilder("user")
      .addSelect("user.privateKey")
      .where("user.id = :id", { id: signerId })
      .getOne();

    if (!signerUser?.privateKey)
      throw new BadRequestException("Signer wallet missing");

    const decryptedKey = await decrypt(signerUser.privateKey);

    // ---------------------------------------------------------
    // STEP 2: LOCAL FILTERING & UPSERT PREP (Fixes Duplicate Key Error)
    // ---------------------------------------------------------

    const validRecords: Record[] = [];
    const signaturesToSave: RecordSignature[] = [];
    const rejectedIds: string[] = [];

    for (const record of records) {
      // 1. Check Authorization
      const isAuthorized = record.credentialType.signers.some(
        (u) => u.id === signerId,
      );

      // Find if we already tried to sign this (Failed or Pending)
      let existingSig = record.signatures.find((s) => s.signer.id === signerId);

      // If already CONFIRMED, skip it entirely
      if (existingSig && existingSig.status === SignatureStatus.CONFIRMED) {
        rejectedIds.push(record.id);
        continue;
      }

      if (!isAuthorized) {
        rejectedIds.push(record.id);
        continue;
      }

      // 4. Prepare the Entity (Upsert Logic)
      if (existingSig) {
        // REUSE existing row (This triggers an UPDATE because it has an ID)
        existingSig.status = SignatureStatus.PENDING;
        existingSig.txHash = null; // Clear old hash from failed attempt
        signaturesToSave.push(existingSig);
      } else {
        // CREATE new row (This triggers an INSERT)
        const newSig = new RecordSignature();
        newSig.record = record;
        newSig.signer = signerUser;
        newSig.status = SignatureStatus.PENDING;
        signaturesToSave.push(newSig);
      }

      validRecords.push(record);
    }

    if (validRecords.length === 0) {
      return {
        status: SigningResultStatus.FAILED,
        message: "No valid records",
        rejectedIds: rejectedIds,
      };
    }

    // ---------------------------------------------------------
    // STEP 3: SAVE INTENT (Bulk Upsert)
    // ---------------------------------------------------------
    // TypeORM .save() is smart.
    // If the entity has an ID (reused), it UPDATES. If no ID, it INSERTS.
    await signatureRepo.save(signaturesToSave);

    try {
      const batchPayload = validRecords.map((r) => r.credentialRef);

      // CALL: Blockchain Service
      const txResponse = await this.blockchainService.batchSignRecords(
        batchPayload,
        decryptedKey,
      );

      // Wait for the confirmation to get the Receipt
      const receipt = await txResponse.wait();
      if (receipt.status !== 1) throw new Error("Batch Transaction Reverted");

      // --- CALCULATE GAS METRICS ---
      // receipt.gasUsed and receipt.gasPrice are BigInts
      const totalGasUsed = Number(receipt.gasUsed);
      const gasPrice = Number(receipt.gasPrice);
      const blockNumber = receipt.blockNumber;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Update signatures with blockchain details
        await queryRunner.manager
          .createQueryBuilder()
          .update(RecordSignature)
          .set({
            status: SignatureStatus.CONFIRMED,
            txHash: txResponse.hash,
            gasUsed: totalGasUsed, // Store in DB
            blockNumber: blockNumber, // Store in DB
          })
          .where("record_id IN (:...ids)", {
            ids: validRecords.map((r) => r.id),
          })
          .andWhere("signer_id = :signerId", { signerId })
          .execute();

        for (const record of validRecords) {
          await queryRunner.manager.increment(
            Record,
            { id: record.id },
            "currentSignatures",
            1,
          );
        }

        await queryRunner.commitTransaction();

        // Return the expected SigningResponse
        return {
          status: SigningResultStatus.SUCCESS,
          txHash: txResponse.hash,
          signedCount: validRecords.length,
          rejectedCount: rejectedIds.length,
          totalGasUsed: totalGasUsed,
          blocknumber: blockNumber,
          gasPrice: gasPrice,
          signatureIds: signaturesToSave.map((s) => s.id), // Note: These are the local entities
        };
      } catch (dbError) {
        await queryRunner.rollbackTransaction();
        throw dbError;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      // ---------------------------------------------------------
      // STEP 6: ERROR HANDLING (All-or-Nothing)
      // ---------------------------------------------------------
      // If the batch transaction fails, NONE of them are signed.

      // Mark all attempts as FAILED in DB
      await signatureRepo
        .createQueryBuilder()
        .update(RecordSignature)
        .set({ status: SignatureStatus.FAILED })
        .where("record_id IN (:...ids)", { ids: validRecords.map((r) => r.id) })
        .andWhere("signer_id = :signerId", { signerId })
        .execute();

      throw new BadRequestException(
        "Batch transaction failed: " + error.message,
      );
    }
  }
}
