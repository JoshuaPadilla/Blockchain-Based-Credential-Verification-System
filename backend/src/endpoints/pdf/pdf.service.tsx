import { Injectable } from '@nestjs/common';
import { renderToStream } from '@react-pdf/renderer';
import { DiplomaPDF } from 'src/certificate_templates/diploma_pdf';
import React from 'react'; // Mandatory for JSX

@Injectable()
export class PdfService {
  async generateCertificate(
    studentName: string,
  ): Promise<NodeJS.ReadableStream> {
    // Render the React component to a stream
    const stream = await renderToStream(<DiplomaPDF />);

    return stream;
  }
}
