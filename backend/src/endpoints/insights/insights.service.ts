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

  async getDashboardInsights() {
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
}
