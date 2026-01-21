import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddSubjectTakenDto } from "src/common/dto/add_subject_taken.dto";
import { CreateStudentAcademicRecordDto } from "src/common/dto/create_academic.dto";
import { Student } from "src/common/entities/student.entity";
import { StudentAcademicRecord } from "src/common/entities/student_academic_record";
import { Subject } from "src/common/entities/subject.entity";
import { SubjectTaken } from "src/common/entities/subjectTaken.entity";
import { In, Repository } from "typeorm";

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
      throw new NotFoundException(`Subjects not found: ${missing.join(", ")}`);
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

  async addSubjectTaken(
    recordId: string,
    addSubjectTakenDto: AddSubjectTakenDto,
  ) {
    const record = await this.studentAcademicRecordRepository.findOne({
      where: { id: recordId },
      relations: ["subjectsTaken", "subjectsTaken.subject"], // <--- CRITICAL: Load nested data
    });

    if (!record) {
      throw new NotFoundException("Academic record not found");
    }

    // 2. Fetch the Subject Catalog definitions (CS 101, ITE 1, etc.)
    const inputCodes = addSubjectTakenDto.subjectsTaken.map(
      (s) => s.subjectCode,
    );
    const foundSubjects = await this.subjectRepository.findBy({
      code: In(inputCodes),
    });

    // 3. Process the Input List
    // We modify the 'record.subjectsTaken' array directly

    addSubjectTakenDto.subjectsTaken.forEach((inputSubject) => {
      // A. Find the definition (e.g., Get the object for 'CS 101')
      const catalogSubject = foundSubjects.find(
        (s) => s.code === inputSubject.subjectCode,
      );
      if (!catalogSubject)
        throw new NotFoundException(
          `Subject ${inputSubject.subjectCode} not found in catalog`,
        );

      // B. Check if the student ALREADY has this subject in this record
      const existingEntry = record.subjectsTaken.find(
        (taken) => taken.subject.code === inputSubject.subjectCode,
      );

      if (existingEntry) {
        // SCENARIO 1: UPDATE (Change Grade)
        existingEntry.grade = inputSubject.grade;
      } else {
        // SCENARIO 2: INSERT (Add New Subject)
        // We manually create the object structure.
        // Since cascade: true is on, TypeORM will save this new entry.
        const newEntry = new SubjectTaken();
        newEntry.grade = inputSubject.grade;
        newEntry.subject = catalogSubject;
        newEntry.academicRecord = record; // Link back to parent

        record.subjectsTaken.push(newEntry);
      }
    });

    // 4. Save the Parent (Cascade handles the rest)
    return await this.studentAcademicRecordRepository.save(record);
  }
}
