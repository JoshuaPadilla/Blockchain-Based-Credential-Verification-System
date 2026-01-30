import * as QRCode from 'qrcode'; // Import the library// 1. Generate the QR Code Data URL
// You can encode the student's name, ID, or a verification URL here.
export const generateQr = (data: string) => {
  return QRCode.toDataURL(data, {
    width: 100,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#00000000', // Transparent background
    },
  });
};
