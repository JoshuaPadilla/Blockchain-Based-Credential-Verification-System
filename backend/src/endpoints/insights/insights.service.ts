import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Record } from "src/common/entities/record.entity";
import { Repository } from "typeorm";

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async getAdminDashboardInsights() {
    const totalRecords = await this.recordRepository.count();
    const pendingRecords = await this.recordRepository
      .createQueryBuilder("record")
      .innerJoin("record.credentialType", "type")
      .where("record.currentSignatures < type.requiredSignaturesCount")
      .getCount();
    const revokedRecords = await this.recordRepository.count({
      where: { revoked: true },
    });

    return { totalRecords, pendingRecords, revokedRecords };
  }

  async getSignerDashboardInsights(userId: string) {
    const totalRecords = await this.recordRepository
      .createQueryBuilder("record")
      .innerJoin("record.credentialType", "type")
      .innerJoin("type.signers", "signer")
      .where("signer.id = :userId", { userId })
      .getCount();

    const pendingRecords = await this.recordRepository
      .createQueryBuilder("record")
      .innerJoinAndSelect("record.student", "student")

      // 1. Join config to check permission
      .innerJoinAndSelect("record.credentialType", "type")

      // 2. Filter: User MUST be in the allowed signers list
      .innerJoin(
        "type.signers",
        "allowedSigner",
        "allowedSigner.id = :userId",
        { userId },
      )

      // 3. Filter: Record MUST NOT be fully signed yet
      .where("record.currentSignatures < type.requiredSignaturesCount")

      // 4. Filter: Record MUST NOT be revoked
      .andWhere("record.revoked IS NOT TRUE")

      // 5. Anti-Join: Check against the new RecordSignature table
      // logic: Join "signatures" where signer is ME.
      .leftJoin(
        "record.signatures",
        "mySignature",
        "mySignature.signer.id = :userId",
        { userId },
      )
      // 6. Keep only records where the join FAILED (meaning I haven't signed yet)
      // We explicitly exclude PENDING/SUBMITTED/CONFIRMED.
      // If you want to allow retrying FAILED txs, see the "Pro Tip" below.
      .andWhere("mySignature.id IS NULL")

      .getCount();

    return { totalRecords, pendingRecords };
  }
}
