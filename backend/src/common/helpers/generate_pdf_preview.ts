import fontkit from '@pdf-lib/fontkit';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Student } from '../entities/student.entity';
import {
  getMonthName,
  getOrdinalDay,
  yearToWords,
} from './number_to_words.helper';

export async function generatedDiplomaPreview(
  student: Student,
): Promise<Buffer> {
  // Read files from the local file system
  const oldEnglishBytes = await fs.readFile(
    path.join(process.cwd(), 'src/assets/fonts/Canterbury.ttf'),
  );
  const existingPdfBytes = await fs.readFile(
    path.join(process.cwd(), 'src/certificate_templates/diploma_template.pdf'),
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];
  const oldEnglishFont = await pdfDoc.embedFont(oldEnglishBytes);
  const timesNew = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const today = new Date();
  const name = student.firstName + student.middleName + student.lastName;
  const course = student.course ?? '';
  const year = `${yearToWords(today.getFullYear())}. `;
  const date = `${getOrdinalDay(today.getDate())} day of ${getMonthName(today.getMonth() + 1)}.`;

  const nameSize = 40;
  const courseSize = 30;
  const pageWidth = page.getWidth();

  const nameWidth = timesNew.widthOfTextAtSize(name, nameSize);
  const courseWidth = oldEnglishFont.widthOfTextAtSize(course, courseSize);

  const nameX = (pageWidth - nameWidth) / 2;
  const courseX = (pageWidth - courseWidth) / 2;

  page.drawText(name, {
    x: (pageWidth - nameWidth) / 2,
    y: 330,
    size: nameSize,
    font: timesNew,
    color: rgb(0, 0, 0),
  });

  page.drawText(course, {
    x: (pageWidth - courseWidth) / 2,
    y: 240,
    size: courseSize,
    font: oldEnglishFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(name, {
    x: nameX, // Centered X coordinate
    y: 330,
    size: nameSize,
    font: timesNew,
    color: rgb(0, 0, 0),
  });

  page.drawText(course, {
    x: courseX, // Centered X coordinate
    y: 240,
    size: 30,
    font: oldEnglishFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(date, {
    x: 252, // Centered X coordinate
    y: 116,
    size: 16,
    font: oldEnglishFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(year, {
    x: 500, // Centered X coordinate
    y: 116,
    size: 16,
    font: oldEnglishFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  // Return the PDF as a Buffer
  return Buffer.from(pdfBytes);
}
