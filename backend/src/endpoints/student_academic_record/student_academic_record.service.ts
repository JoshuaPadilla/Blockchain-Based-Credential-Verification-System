import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentAcademicRecordDto } from 'src/dto/create_academic.dto';
import { Student } from 'src/entities/student.entity';
import { StudentAcademicRecord } from 'src/entities/student_academic_record';
import { Subject } from 'src/entities/subject.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class AcademicRecordService {
  constructor(
    @InjectRepository(StudentAcademicRecord)
    private readonly studentAcademicRecordRepository: Repository<StudentAcademicRecord>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createAcademicRecordDto: CreateStudentAcademicRecordDto) {
    const student = await this.studentRepository.findOneBy({
      id: createAcademicRecordDto.studentId,
    });

    if (!student) {
      throw new NotFoundException(
        `Student with id ${createAcademicRecordDto.studentId} not found`,
      );
    }

    // STEP 1: Extract all codes from the input
    const codes = createAcademicRecordDto.subjectsTaken.map(
      (s) => s.subjectCode,
    );

    // STEP 2: Fetch ALL relevant subjects in ONE query
    // SELECT * FROM subjects WHERE code IN ('CS 101', 'Math 1', ...)
    const foundSubjects = await this.subjectRepository.findBy({
      code: In(codes),
    });

    // STEP 3: Verify we found everything
    if (foundSubjects.length !== codes.length) {
      // Optional: Logic to tell the user WHICH code was wrong
      const foundCodes = foundSubjects.map((s) => s.code);
      const missing = codes.filter((c) => !foundCodes.includes(c));
      throw new NotFoundException(`Subjects not found: ${missing.join(', ')}`);
    }

    const newRecord = this.studentAcademicRecordRepository.create({
      schoolYear: createAcademicRecordDto.schoolYear,
      semester: createAcademicRecordDto.semester,
      student: student,
      subjectsTaken: createAcademicRecordDto.subjectsTaken.map((dtoSubject) => {
        // Find the matching entity we fetched earlier
        const subjectEntity = foundSubjects.find(
          (s) => s.code === dtoSubject.subjectCode,
        );

        return {
          grade: dtoSubject.grade,
          subject: subjectEntity, // Link the actual Entity here
        };
      }),
    });

    return await this.studentAcademicRecordRepository.save(newRecord);
  }
}
