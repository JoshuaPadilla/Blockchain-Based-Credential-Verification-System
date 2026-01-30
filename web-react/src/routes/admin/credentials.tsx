import { DiplomaPDF } from "@/components/pdf_documents/diploma/diploma_pdf";
import { DiplomaFinal } from "@/components/pdf_documents/diploma_final/diploma_final";
import { Button } from "@/components/ui/button";
import { usePDF } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";
import { Document, Page } from "react-pdf";

export const Route = createFileRoute("/admin/credentials")({
	component: RouteComponent,
});

function RouteComponent() {
	const [instance, setInstance] = usePDF({
		document: <DiplomaFinal name={""} course={""} distinction={""} />,
	});

	const handleSetInstance = () => {
		setInstance(<DiplomaPDF qrUrl="sample" />);
	};
	return (
		<div className="w-full h-screen p-8 bg-slate-500">
			<Button variant={"default"} onClick={handleSetInstance}>
				Change
			</Button>

			<div className="flex flex-1 p-4 bg-amber-100 h-full">
				<Document file={instance.url}>
					<Page
						pageNumber={1}
						renderTextLayer={false}
						renderAnnotationLayer={false}
					/>
				</Document>
			</div>
		</div>
	);
}
