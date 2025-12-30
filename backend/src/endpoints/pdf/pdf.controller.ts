import { Controller, Get, Res, Query } from '@nestjs/common';
import { PdfService } from './pdf.service';
import type { Response } from 'express';
import { Font } from '@react-pdf/renderer';
import path from 'path';

Font.register({
  family: 'GreatVibes',
  src: path.join(
    process.cwd(),
    'src/assets',
    'fonts',
    'GreatVibes-Regular.ttf',
  ),
});

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: path.join(process.cwd(), 'src/assets', 'fonts', 'Montserrat.ttf') },
    {
      src: path.join(
        process.cwd(),
        'src/assets',
        'fonts',
        'Montserrat-Bold.ttf',
      ),
      fontWeight: 'bold',
    },
    {
      src: path.join(
        process.cwd(),
        'src/assets',
        'fonts',
        'Montserrat-Medium.ttf',
      ),
      fontWeight: 'medium',
    },
  ],
});

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // The endpoint will be: http://localhost:3000/pdf/download?name=Joshua
  @Get('download')
  async downloadPdf(
    @Query('name') name: string,
    @Res() res: Response, // We need direct access to the Express response
  ) {
    const studentName = name || 'Student';

    // 1. Ask the Service to create the stream
    const pdfStream = await this.pdfService.generateCertificate(studentName);

    // 2. Tell the browser "This is a PDF file, please download it"
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificate-${studentName}.pdf`,
    });

    // 3. Send the stream to the user
    pdfStream.pipe(res);
  }
}
