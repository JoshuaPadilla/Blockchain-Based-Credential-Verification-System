import {
  Document as PDFDocument,
  Image,
  Page,
  View,
  Text,
} from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';
import { getBackgroundImage } from 'src/common/helpers/get_bg_image.helper';
import React from 'react';

export const DiplomaPDF = () => {
  const bgImage = getBackgroundImage();
  return (
    <PDFDocument>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* 2. Render Order Matters!
           In React-PDF, there is no zIndex. 
           The element defined LAST is drawn ON TOP.
           
           Background Image goes FIRST.
        */}
        <Image src={bgImage} style={styles.background} fixed />

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
    </PDFDocument>
  );
};

const styles = StyleSheet.create({
  page: { position: 'relative' },
  background: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    height: '100%',
    width: '100%',
  },
  content: {
    padding: 40,
    // ... your text styles
  },
  nameContainer: {
    position: 'absolute',
    top: '32%', // Adjust these coordinates to place the name where you want
    left: 0,
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: 'center',
    justifyContent: 'center',
  },
  degreeContainer: {
    position: 'absolute',
    top: '52%', // Adjust these coordinates to place the name where you want
    left: 0,
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    position: 'absolute',
    top: '65%', // Adjust these coordinates to place the name where you want
    left: '14%',
    right: 0, // Setting left & right to 0 combined with textAlign center centers it horizontally
    textAlign: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 64,
    fontFamily: 'GreatVibes',
  },

  degreeText: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: 'medium',
  },

  dateText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
});
