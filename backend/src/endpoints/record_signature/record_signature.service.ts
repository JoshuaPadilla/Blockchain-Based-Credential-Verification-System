import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordSignature } from "src/common/entities/record_signature.entity";
import { Repository } from "typeorm";

@Injectable()
export class RecordSignatureService {
  constructor(
    @InjectRepository(RecordSignature)
    private recordSignatureRepository: Repository<RecordSignature>,
  ) {}

  async findOne(id: string): Promise<RecordSignature | null> {
    return this.recordSignatureRepository.findOne({
      where: { id },
      relations: ["record", "record.student"],
    });
  }

  async findAll(): Promise<RecordSignature[]> {
    return this.recordSignatureRepository.find();
  }
}
