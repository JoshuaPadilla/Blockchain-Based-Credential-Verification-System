import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateStudentDto } from "src/common/dto/create_student.dto";
import { Student } from "src/common/entities/student.entity";
import { Brackets, Repository } from "typeorm";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll(term?: string): Promise<Student[]> {
    const query = this.studentRepository
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.academicRecords", "academicRecords")
      .leftJoinAndSelect("academicRecords.subjectsTaken", "subjectsTaken");

    if (term) {
      query.where(
        new Brackets((qb) => {
          // 1. Check ID (matches "22", "22-00", "00377", etc.)
          qb.where("student.student_id ILike :search", { search: `${term}%` }) // Use `${term}%` if you only want start-match, or `%${term}%` for anywhere match

            // 2. Check First/Middle/Last names individually
            .orWhere("student.firstName ILike :search", { search: `%${term}%` })
            .orWhere("student.lastName ILike :search", { search: `%${term}%` })
            .orWhere("student.middleName ILike :search", {
              search: `%${term}%`,
            })

            // 3. Check Full Name (Handling NULL middle names)
            // COALESCE ensures that if middleName is null, it treats it as an empty string ''
            // otherwise 'John' + NULL + 'Doe' becomes NULL and the record is hidden.
            .orWhere(
              "CONCAT(student.firstName, ' ', COALESCE(student.middleName, ''), ' ', student.lastName) ILike :search",
              { search: `%${term}%` },
            );
        }),
      );
    } else {
      query.take(10);
    }

    return query.getMany();
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
