import oldEnglish from "@/assets/fonts/Canterbury.ttf";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as QRCode from "qrcode";
import diploma_template from "../assets/diploma_template.pdf";
import {
	getMonthName,
	getOrdinalDay,
	yearToWords,
} from "./number_to_words.helper";

export async function generateTestPdf() {
	const qrDataUrl = await QRCode.toDataURL("sample qr hahahahahahahahaha", {
		width: 100,
		margin: 1,
		color: {
			dark: "#000000",
			light: "#00000000", // Transparent background
		},
		errorCorrectionLevel: "L",
	});

	// 2. Embed the PNG/JPG image into the PDF
	// We remove the "data:image/png;base64," prefix
	const qrImageBytes = await fetch(qrDataUrl).then((res) =>
		res.arrayBuffer(),
	);

	const oldEnglishBytes = await fetch(oldEnglish).then((res) =>
		res.arrayBuffer(),
	);
	const existingPdfBytes = await fetch(diploma_template).then((res) =>
		res.arrayBuffer(),
	);
	const pdfDoc = await PDFDocument.load(existingPdfBytes);
	const page = pdfDoc.getPages()[0];
	pdfDoc.registerFontkit(fontkit);

	const qrImage = await pdfDoc.embedPng(qrImageBytes);
	const oldEnglishFont = await pdfDoc.embedFont(oldEnglishBytes);
	const timesNew = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

	if (!page) {
		throw new Error("Template PDF has no pages.");
	}

	const today = new Date();
	const name = "JOSHUA VINCENT PADILLA";
	const course = "Bachelor of Science in Computer Science";
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
		x: pageWidth - 145,
		y: pageHeight - 145,
		width: 80,
		height: 80,
	});

	const pdfBytes = await pdfDoc.save();

	// Return a Blob URL for your <iframe /> or react-pdf
	return URL.createObjectURL(
		new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
	);
}
