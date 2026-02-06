import pdfjs from "@/lib/pdf-setup"; // Make sure this points to your setup file

export async function pdfBlobToDataUrl(blob: Blob): Promise<string> {
	const url = URL.createObjectURL(blob);

	try {
		const loadingTask = pdfjs.getDocument(url);
		const pdf = await loadingTask.promise;
		const page = await pdf.getPage(1);

		// ⚡ SPEED FIX 1: Reduce Scale
		// Scale 1.5 is crisp enough for Retina screens but 50% faster than 2.0
		// If it's just a small thumbnail, use scale: 1.0
		const viewport = page.getViewport({ scale: 1.5 });

		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d", {
			alpha: false, // ⚡ SPEED FIX 2: Disable transparency (faster rendering)
		});

		if (!context) throw new Error("Canvas context could not be created");

		canvas.height = viewport.height;
		canvas.width = viewport.width;

		await page.render({
			canvasContext: context,
			viewport: viewport,
			canvas: canvas,
		}).promise;

		// ⚡ SPEED FIX 3: Use JPEG instead of PNG
		// PNG encoding is very CPU heavy. JPEG is fast.
		// Quality 0.8 reduces file size by ~80% with no visible difference.
		const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

		return dataUrl;
	} finally {
		URL.revokeObjectURL(url);
	}
}
