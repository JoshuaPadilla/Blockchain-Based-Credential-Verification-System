import { pdfjs } from "react-pdf";

// Point specifically to the static file in your public folder
// We use 'window.location.origin' to ensure it works on VPS subpaths if needed
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default pdfjs;
