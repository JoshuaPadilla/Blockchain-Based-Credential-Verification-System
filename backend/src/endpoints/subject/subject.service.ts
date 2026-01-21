import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateSubjectDto } from "src/common/dto/create_subject.dto";
import { Subject } from "src/common/entities/subject.entity";
import { Repository } from "typeorm";

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async findall(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);

    return this.subjectRepository.save(subject);
  }

  async findOne(id: string): Promise<Subject | null> {
    return this.subjectRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateSubjectDto: Partial<CreateSubjectDto>,
  ): Promise<Subject> {
    const subject = await this.subjectRepository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException("Subject not found");
    }

    return this.subjectRepository.save({
      ...subject,
      ...updateSubjectDto,
    });
  }
}
