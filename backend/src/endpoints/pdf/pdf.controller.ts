import { Controller, Get, Res, Query } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import type { Response } from "express";
import { Font } from "@react-pdf/renderer";
import path from "path";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // The endpoint will be: http://localhost:3000/pdf/download?name=Joshua
  @Get("preview")
  async downloadPdf(
    @Query("student") name: string,
    @Res() res: Response, // We need direct access to the Express response
  ) {
    // const studentName = name || "Student";
    // // 1. Ask the Service to create the stream
    const pdfStream = await this.pdfService.generateCertificate();
    // // 2. Tell the browser "This is a PDF file, please download it"
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=certificate.pdf`,
    });
    // // 3. Send the stream to the user
    pdfStream.pipe(res);

    pdfStream.on("end", () => res.end());
    pdfStream.on("error", (err) => {
      console.error(err);
      res.status(500).end();
    });
  }
}
