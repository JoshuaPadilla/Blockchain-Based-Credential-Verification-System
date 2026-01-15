import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateStudentDto } from "src/dto/create_student.dto";
import { Student } from "src/entities/student.entity";
import { Repository } from "typeorm";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      relations: ["academicRecords", "academicRecords.subjectsTaken"],
    });
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);

    await this.studentRepository.save(student);

    return this.studentRepository.findOneOrFail({
      where: { id: student.id },
      relations: ["academicRecords", "academicRecords.subjectsTaken"], // <--- Specify relations here
    });
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateStudentDto: Partial<CreateStudentDto>,
  ): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException("student not found");
    }

    await this.studentRepository.save({
      id, // Explicitly passing ID ensures an UPDATE, not INSERT
      ...updateStudentDto,
    });

    // 3. Fetch the FRESH complete record with relations to return
    return this.studentRepository.findOneOrFail({
      where: { id },
      relations: ["academicRecords", "academicRecords.subjectsTaken"], // <--- Specify relations here
    });
  }
}
