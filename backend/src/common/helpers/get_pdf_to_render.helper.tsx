import { NotFoundException } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { CredentialType } from '../enums/credential_type.enum';

import fontkit from '@pdf-lib/fontkit';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';
import { Record } from '../entities/record.entity';
import {
  getMonthName,
  getOrdinalDay,
  yearToWords,
} from './number_to_words.helper';

const formatStudentName = (student: Student): string => {
  return [student.firstName, student.middleName, student.lastName]
    .filter((part) => !!part)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getPdfToRender = (
  record: Record,
  qrContent: string,
): Promise<Buffer | string> => {
  switch (record.credentialType.name) {
    case CredentialType.DIPLOMA:
      return generateDiploma(record, qrContent);

    default:
      throw new NotFoundException(
        `Unsupported credential type: ${record.credentialType.name}`,
      );
  }
};

export async function generateDiploma(
  record: Record,
  qrContent: string,
): Promise<Buffer> {
  // Read files from the local file system
  const oldEnglishBytes = await fs.readFile(
    path.join(process.cwd(), 'src/assets/fonts/Canterbury.ttf'),
  );
  const diplomaTemplateBytes = await fs.readFile(
    path.join(process.cwd(), 'src/certificate_templates/diploma_template.pdf'),
  );

  const pdfDoc = await PDFDocument.load(diplomaTemplateBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];
  const oldEnglishFont = await pdfDoc.embedFont(oldEnglishBytes);
  const timesNew = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const qrBuffer = await QRCode.toBuffer(qrContent, {
    width: 200,
    margin: 1,
  });

  const qrImage = await pdfDoc.embedPng(qrBuffer);

  const today = new Date(record.createdAt) ?? new Date();
  const name = formatStudentName(record.student);
  const course = record.student.course ?? '';
  const year = `${yearToWords(today.getFullYear())}. `;
  const date = `${getOrdinalDay(today.getDate())} day of ${getMonthName(today.getMonth() + 1)}.`;

  const nameSize = 40;
  const courseSize = 30;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

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

  page.drawImage(qrImage, {
    x: pageWidth - 125,
    y: pageHeight - 125,
    width: 40,
    height: 40,
  });

  const pdfBytes = await pdfDoc.save();

  // Return the PDF as a Buffer
  return Buffer.from(pdfBytes);
}
