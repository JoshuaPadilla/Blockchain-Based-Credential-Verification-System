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
      // 1. Join config to check permission and limits
      .innerJoinAndSelect("record.credentialType", "type")

      // 2. Filter: User MUST be in the allowed signers list for this type
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

      // 5. Anti-Join: Check if user has ALREADY signed this specific record
      .leftJoin(
        "record.signedBy",
        "alreadySigned",
        "alreadySigned.id = :userId",
        { userId },
      )
      .andWhere("alreadySigned.id IS NULL") // Keep only records where the join failed (user hasn't signed)

      .getCount();

    return { totalRecords, pendingRecords };
  }
}
