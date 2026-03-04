import { PDFViewer } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/credentials/preview")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col h-screen w-full">
			<PDFViewer className="w-full h-full border-none">
				{/* <DiplomaFinal /> */}
			</PDFViewer>
		</div>
	);
}
