import { Injectable, NotFoundException } from "@nestjs/common";
import { renderToBuffer, renderToStream } from "@react-pdf/renderer";
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

    // const qrCodeData = await generateQr("myapp.com/verify/asdsass");

    const student = await this.studentRepo.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const diplomaPdf = getPdfToRender(student, credentialType);

    if (!diplomaPdf) {
      throw new NotFoundException("credential type not found");
    }

    const stream = await renderToStream(
      diplomaPdf as React.ReactElement<DocumentProps>,
    );

    
    return stream;
  }
}
