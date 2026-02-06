import { pdfjs } from 'react-pdf';

// Ensure worker is set up (you likely already have this in your app entry point)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export async function pdfBlobToDataUrl(blob: Blob, scale = 2): Promise<string> {
  // 1. Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  try {
    // 2. Load the Document
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;

    // 3. Get the first page (Page 1)
    const page = await pdf.getPage(1);

    // 4. Calculate viewport (Dimensions)
    // Scale 2.0 is recommended for sharp images on Retina displays
    const viewport = page.getViewport({ scale: scale });

    // 5. Create an off-screen Canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) throw new Error('Canvas context could not be created');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // 6. Render the PDF page into the Canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };
    
    await page.render(renderContext).promise;

    // 7. Extract the image as a Data URL (Base64 PNG)
    const dataUrl = canvas.toDataURL('image/png');

    return dataUrl;
  } finally {
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(url);
  }
}