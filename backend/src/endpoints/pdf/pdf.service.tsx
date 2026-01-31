import { Injectable, NotFoundException } from "@nestjs/common";
import { renderToStream } from "@react-pdf/renderer";
import React from "react"; // Mandatory for JSX
import { Diploma } from "../../pdf_templates/diploma/diploma";
import { generateQr } from "src/common/helpers/qr_helper";
import { getPdfToRender } from "src/common/helpers/get_pdf_to_render.helper";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/common/entities/student.entity";
import { Repository } from "typeorm";
import { CredentialType } from "src/common/enums/credential_type.enum";
import { DocumentProps } from "@react-pdf/renderer";

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  async generateCertificate(
    studentId: string,
    credentialType: CredentialType,
  ): Promise<NodeJS.ReadableStream> {
    // Render the React component to a stream

    const qrCodeData = await generateQr(
      "myapp.com/verify/dff2e07f-342d-48a3-bc99-a9a16f015b08",
    );

    const student = await this.studentRepo.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const diplomaPdf = getPdfToRender(student, credentialType, qrCodeData);

    if (!diplomaPdf) {
      throw new NotFoundException("credential type not found");
    }

    const stream = await renderToStream(
      diplomaPdf as React.ReactElement<DocumentProps>,
    );
    return stream;
  }
}
