import { pdfjs } from "react-pdf";

// 1. Set the worker (as before)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// 2. Set the cMap url (Crucial for text stability)
// This ensures complex text doesn't crash the renderer

export default pdfjs;
