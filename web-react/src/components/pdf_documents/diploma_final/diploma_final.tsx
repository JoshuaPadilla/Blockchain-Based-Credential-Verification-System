import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import school_logo from "@/assets/img/school_logo.png";
import border from "../assets/diploma_bg.png";
import { getOrdinalDay, yearToWords } from "@/helpers/number_to_words.helper";

interface DiplomaProps {
	name: string;
	course: string;
	distinction: string;
	qrCodeUrl?: string; // Added prop for dynamic QR code
}

export const DiplomaFinal = ({
	name = "JUAN DELA CRUZ",
	course = "Bachelor of Science in Office Administration",
	distinction = "MAGNA CUM LAUDE",
	qrCodeUrl = "sample",
}: DiplomaProps) => {
	const today = new Date();

	const date = getOrdinalDay(today.getDate());
	const year = yearToWords(today.getFullYear());

	return (
		<Document>
			<Page size="A4" orientation="landscape" style={styles.page}>
				{/* LAYER 1: Background Watermark */}
				<Image src={school_logo} style={styles.watermark} fixed />

				{/* LAYER 2: Border */}
				<Image src={border} style={styles.border} fixed />

				{/* LAYER 3: Content (Text & Logos) */}
				<View style={styles.contentContainer}>
					{/* Header */}
					<View style={styles.header}>
						{/* school logo */}
						<Image src={school_logo} style={styles.headerLogo} />

						{/* header texts */}
						<View style={styles.headerTextCol}>
							<Text style={styles.republic}>
								Republic of the Philippines
							</Text>
							<Text style={styles.universityName}>
								Northwest Samar State University
							</Text>
							<Text style={styles.city}>Calbayog City</Text>
						</View>

						{/* RIGHT: QR Code Placeholder */}
						{/* Only renders if qrCodeUrl is provided */}
						{qrCodeUrl && (
							<Image src={qrCodeUrl} style={styles.headerQr} />
						)}
					</View>

					{/* Salutation */}
					<View style={styles.salutationSection}>
						<Text style={styles.oldEnglishText}>
							To All Whom These Presents May Come
						</Text>
						<Text style={styles.greetings}>Greetings:</Text>
					</View>

					{/* Body */}
					<Text style={styles.bodyText}>
						Be it known that the Board of Regents by authority of
						the Republic of the Philippines upon recommendation of
						the University Council has awarded to
					</Text>

					{/* STUDENT NAME */}
					<Text style={styles.studentName}>{name}</Text>

					<Text style={styles.bodyText}>
						who has fulfilled all requirements for the degree of
					</Text>

					{/* COURSE */}
					<Text style={styles.courseName}>{course}</Text>

					{/* DISTINCTION */}
					{distinction && (
						<Text style={styles.distinction}>{distinction}</Text>
					)}

					{/* Testimony */}
					<Text style={styles.testimony}>
						IN TESTIMONY WHEREOF, the seal of the University and the
						signatures of the University President and the Registrar
						are hereunto affixed.
					</Text>

					{/* Date */}
					<Text style={styles.dateText}>
						Given at Northwest Samar State University, Calbayog
						City, Philippines this {date} day of April in the year
						of our Lord {year}.
					</Text>

					{/* Signatures */}
					<View style={styles.signatureRow}>
						<View style={styles.signatureBlock}>
							<Text style={styles.signatoryName}>
								RYAN EMIL T. ZOSA, IV
							</Text>
							<Text style={styles.signatoryTitle}>
								University Registrar
							</Text>
						</View>

						<View style={styles.signatureBlock}>
							<Text style={styles.signatoryName}>
								BENJAMIN L. PECAYO, Ed. D.
							</Text>
							<Text style={styles.signatoryTitle}>
								University President
							</Text>
						</View>
					</View>

					{/* Footer Note */}
					<Text style={styles.footerNote}>
						(Note: Paid documentary stamp P30.00)
					</Text>
				</View>
			</Page>
		</Document>
	);
};
