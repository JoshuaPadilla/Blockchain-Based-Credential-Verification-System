import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Record } from "src/common/entities/record.entity";
import { Student } from "src/common/entities/student.entity";
import { CredentialType } from "src/common/enums/credential_type.enum";
import { generatedDiplomaPreview } from "src/common/helpers/generate_pdf_preview";
import { getPdfToRender } from "src/common/helpers/get_pdf_to_render.helper";
import { Repository } from "typeorm";

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Record) private recordRepository: Repository<Record>,
  ) {}

  async generatePreview(
    studentId: string,
    credentialType: CredentialType,
  ): Promise<Buffer> {
    // Render the React component to a stream

    // const qrCodeData = await generateQr("myapp.com/verify/asdsass");

    const student = await this.studentRepo.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const pdfBuffer = await generatedDiplomaPreview(student);

    return pdfBuffer;
  }

  async generateFinalPdf(recordId: string): Promise<Buffer | string> {
    // Render the React component to a stream

    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ["student", "credentialType"],
    });

    if (!record || !record.student || !record.credentialType) {
      throw new NotFoundException("No Record Found, Please verify again");
    }

    const qrContent = `https://cert-us.website/verify/${record.credentialRef}`;
    const pdfBuffer = await getPdfToRender(record, qrContent);

    return pdfBuffer;
  }
}
