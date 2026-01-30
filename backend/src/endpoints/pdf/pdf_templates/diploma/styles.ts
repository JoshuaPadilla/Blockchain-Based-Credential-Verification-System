import { Font, StyleSheet } from "@react-pdf/renderer";

import { join } from "path";

Font.register({
  family: "Old English",
  src: join(process.cwd(), "src/assets/fonts/Canterbury.ttf"),
});

Font.register({
  family: "Times-Bold",
  src: join(process.cwd(), "src/assets/fonts/tomnr.ttf"),
});

export const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Times-Roman",
    padding: 0,
  },
  // Fixed Background Watermark
  watermark: {
    position: "absolute",
    top: "10%",
    left: "15%", // Adjusted to center visually
    height: "80%",
    width: "70%",
    objectFit: "contain",
    opacity: 0.15, // Light opacity for watermark
    zIndex: -1,
  },
  // Fixed Border
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  // Main Content Wrapper
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    paddingHorizontal: 60,
    paddingTop: 50,
    paddingBottom: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 10,
  },
  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
    position: "relative",
  },
  headerLogo: {
    width: 60,
    height: 60,
    position: "absolute",
    left: 20, // Position logo to the left like the image
    top: 0,
  },
  headerTextCol: {
    flexDirection: "column",
    alignItems: "center",
  },
  republic: {
    fontSize: 12,
    marginBottom: 4,
  },
  universityName: {
    fontFamily: "Old English", // Custom font
    fontSize: 28,
    marginBottom: 4,
  },
  city: {
    fontSize: 12,
  },
  // Salutation
  salutationSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  oldEnglishText: {
    fontFamily: "Old English",
    fontSize: 14,
    marginBottom: 4,
  },
  greetings: {
    fontFamily: "Old English",
    fontSize: 18,
    marginTop: 5,
  },
  // Body Styles
  bodyText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 1.5,
    width: "90%",
    marginTop: 10,
  },
  studentName: {
    fontSize: 32,
    fontFamily: "Times-Bold", // Make sure to use a bold font
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  courseName: {
    fontFamily: "Old English",
    fontSize: 24,
    marginTop: 10,
    textAlign: "center",
  },
  distinction: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    marginTop: 8,
  },
  testimony: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
    width: "85%",
  },
  dateText: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 40,
    width: "85%",
  },
  // Signatures
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
  signatureBlock: {
    alignItems: "center",
    minWidth: 200,
  },
  signatoryName: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    fontWeight: "bold",
    textTransform: "uppercase",
    textDecoration: "none", // Image doesn't have underlining, just titles below
  },
  signatoryTitle: {
    fontSize: 11,
    marginTop: 2,
  },
  footerNote: {
    position: "absolute",
    bottom: 20,
    left: 30,
    fontSize: 8,
    fontStyle: "italic",
  },
  headerQr: {
    width: 60,
    height: 60,
    position: "absolute",
    right: 20, // Puts it on the right side
    top: 0,
  },
});
