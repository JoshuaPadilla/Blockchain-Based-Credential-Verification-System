import { Injectable } from "@nestjs/common";
import { renderToStream } from "@react-pdf/renderer";
import React from "react"; // Mandatory for JSX
import { Diploma } from "./pdf_templates/diploma/diploma";
import { generateQr } from "src/common/helpers/qr_helper";

@Injectable()
export class PdfService {
  async generateCertificate(): Promise<NodeJS.ReadableStream> {
    // Render the React component to a stream

    const qrCodeData = await generateQr("sample only");

    const stream = await renderToStream(<Diploma qrCodeUrl={qrCodeData} />);

    return stream;
  }
}
