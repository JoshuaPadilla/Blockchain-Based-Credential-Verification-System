import { Font, StyleSheet } from "@react-pdf/renderer";
import greatVibesFont from "../../assets/fonts/GreatVibes-Regular.ttf";
import mont_bold from "../../assets/fonts/Montserrat-Bold.ttf";
import mont_reg from "../../assets/fonts/Montserrat-Regular.ttf";
import mont_med from "../../assets/fonts/Montserrat-Medium.ttf";

Font.register({
  family: "GreatVibes",
  src: greatVibesFont,
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: mont_reg },
    { src: mont_bold, fontWeight: "bold" },
    { src: mont_med, fontWeight: "medium" },
  ],
});

export const styles = StyleSheet.create({
  page: { position: "relative" },
  background: {
    position: "absolute",
    minWidth: "100%",
    minHeight: "100%",
    height: "100%",
    width: "100%",
  },
  qrUrl: {
    position: "absolute",
    height: "100px",
    width: "100px",
    top: "75%", // Adjust these coordinates to place the name where you want
    left: "50%", // Moves the left edge to the center
    marginLeft: -50,
  },
  content: {
    padding: 40,
    // ... your text styles
  },
  nameContainer: {
    position: "absolute",
    top: "32%", // Adjust these coordinates to place the name where you want
    left: 0,
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: "center",
    justifyContent: "center",
  },
  degreeContainer: {
    position: "absolute",
    top: "52%", // Adjust these coordinates to place the name where you want
    left: 0,
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: "center",
    justifyContent: "center",
  },
  dateContainer: {
    position: "absolute",
    top: "65%", // Adjust these coordinates to place the name where you want
    left: "14%",
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: 64,
    fontFamily: "GreatVibes",
  },

  degreeText: {
    fontSize: 24,
    fontFamily: "Montserrat",
    fontWeight: "medium",
  },

  dateText: {
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
});
