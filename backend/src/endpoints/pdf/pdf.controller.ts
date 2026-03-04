import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { CredentialType } from "src/common/enums/credential_type.enum";
import { PdfService } from "./pdf.service";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // The endpoint will be: http://localhost:3000/pdf/download?name=Joshua
  @Get("preview")
  async preview(
    @Query("studentId") studentId: string,
    @Query("credentialName") credentialType: CredentialType,
    @Res() res: Response, // We need direct access to the Express response
  ) {
    try {
      // This now returns a Buffer (Uint8Array)
      const pdfBuffer = await this.pdfService.generatePreview(
        studentId,
        credentialType,
      );

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=certificate.pdf`, // 'inline' is better for previews
        "Content-Length": pdfBuffer.length,
      });

      // Send the buffer directly
      res.end(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error generating PDF");
    }
  }

  @Get("final-pdf")
  async getSignedPdf(
    @Query("recordId") recordId: string,
    @Res() res: Response, // We need direct access to the Express response
  ) {
    try {
      // This now returns a Buffer (Uint8Array)
      const pdfBuffer = await this.pdfService.generateFinalPdf(recordId);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=certificate.pdf`, // 'inline' is better for previews
        "Content-Length": pdfBuffer.length,
      });

      // Send the buffer directly
      res.end(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error generating PDF");
    }
  }
}
