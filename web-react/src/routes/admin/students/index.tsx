import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { generateTestPdf } from "@/helpers/pdf_coordinates_tool";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/students/")({
	component: RouteComponent,
	loader: async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
	},
	pendingMs: 0,
	pendingComponent: () => <PendingSkeleton />,
});

function RouteComponent() {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function generatePdf() {
			setIsGenerating(true);
			try {
				const url = await generateTestPdf();
				setPdfUrl(url);
			} catch {
				setError("Failed to generate PDF");
			} finally {
				setIsGenerating(false);
			}
		}

		generatePdf();
	}, []);

	return (
		<div className="min-h-screen bg-[#F8F9FA] p-6 md:p-8">
			{error && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
					{error}
				</div>
			)}
			<div className="rounded-xl border bg-white shadow-sm overflow-hidden min-h-[70vh]">
				{pdfUrl ? (
					<iframe
						title="PDF Preview"
						src={pdfUrl}
						className="h-full min-h-[70vh] w-full"
					/>
				) : (
					<div className="flex h-full min-h-[70vh] items-center justify-center text-sm text-slate-500">
						{isGenerating
							? "Generating preview..."
							: "No preview yet."}
					</div>
				)}
			</div>
		</div>
	);
}
