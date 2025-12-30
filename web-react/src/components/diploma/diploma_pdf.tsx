import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import diploma from "../../assets/cert_bg/diploma_pdf_bg.png";

interface Props {
  qrUrl: string;
}

export const DiplomaPDF = ({ qrUrl }: Props) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* 2. Render Order Matters!
           In React-PDF, there is no zIndex. 
           The element defined LAST is drawn ON TOP.
           
           Background Image goes FIRST.
        */}
        <Image src={diploma} style={styles.background} fixed />

        <Image src={qrUrl} style={styles.qrUrl} fixed />

        {/* Name/Text goes SECOND (so it sits on top of the image) */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>Joshua Vincent Padilla</Text>
        </View>

        <View style={styles.degreeContainer}>
          <Text style={styles.degreeText}>
            Bachelor of Science in Computer Science
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>December 30, 2025</Text>
        </View>
      </Page>
    </Document>
  );
};
