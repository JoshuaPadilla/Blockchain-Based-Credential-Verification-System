import * as path from 'path';
import * as fs from 'fs';

export const getBackgroundImage = () => {
  // Finds the 'assets' folder in your project root
  const imagePath = path.join(
    process.cwd(),
    'src/assets/cert_bg/',
    'diploma_pdf_bg.png',
  );
  // Reads the file into a buffer
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer;
};
