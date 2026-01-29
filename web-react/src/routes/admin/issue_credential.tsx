import { AddStudentTrigger } from "@/components/custom_components/add_student_trigger";
import { SelectCredentialTrigger } from "@/components/custom_components/select_credential_trigger";
import { SelectStudentModal } from "@/components/custom_components/select_student_modal";
import { Button } from "@/components/ui/button";

// 1. Import the Generator Hook
import { usePDF } from "@react-pdf/renderer";

// 2. Import the Viewer Components (Wojtek Maj)
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// 3. Setup the Worker (Mandatory for Wojtek's lib)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { DiplomaPDF } from "@/components/diploma/diploma_pdf";

// Assuming DiplomaPDF is your component built with @react-pdf/renderer primitives

export const Route = createFileRoute("/admin/issue_credential")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isOpen, setIsOpen] = useState(false);

	const [containerWidth, setContainerWidth] = useState<number>();
	console.log(containerWidth);

	// 2. Create a callback ref to measure the element whenever it resizes
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				// Get the width of the container
				if (entries[0]) {
					setContainerWidth(entries[0].contentRect.width);
				}
			});

			resizeObserver.observe(node);

			// Cleanup observer when component unmounts or ref changes
			return () => resizeObserver.disconnect();
		}
	}, []);

	// 4. Generate the PDF Blob in the background
	// 'instance' contains the blob, url, and loading state
	const MyDocument = useMemo(() => <DiplomaPDF qrUrl="sample" />, []);

	const [instance] = usePDF({ document: MyDocument });

	return (
		<>
			<SelectStudentModal isOpen={isOpen} setIsOpen={setIsOpen} />

			<div className=" px-16 py-8 flex flex-col flex-1 justify-start gap-4 ">
				{/* Title */}
				<h3 className="font-mono font-extrabold text-3xl">
					Issue New Credential
				</h3>

				{/* Main content */}
				<div className=" grid grid-cols-8 grid-rows-2 gap-2 w-full h-full">
					{/* Triggers */}
					<div className="col-start-1 col-span-2 row-start-1 row-span-2 flex flex-col gap-2">
						<AddStudentTrigger
							handleClick={() => setIsOpen(true)}
						/>

						<SelectCredentialTrigger />
					</div>

					{/* Preview */}
					<div className="col-span-full col-start-3 row-span-full border border-black/30 rounded-lg flex flex-col overflow-hidden bg-gray-100">
						{/* Header */}
						<div className="flex-none border-b border-black/30 bg-white flex justify-between items-center h-15 p-4">
							<h1 className="font-heading text-xl">
								Credential Preview
							</h1>

							{/* 5. Custom Download Button */}
							{/* We use a standard HTML <a> tag pointing to the generated URL */}
							{instance.url && (
								<Button asChild>
									<a
										href={instance.url}
										download="credential.pdf"
									>
										Download PDF
									</a>
								</Button>
							)}
						</div>

						{/* 6. The "Wojtek Maj" Viewer */}
						{/* Renders as a Canvas/Image. No iframe scrollbars. */}
						<div className="flex-1 flex justify-center items-center overflow-hidden w-full h-full p-4 gap-4">
							{/* Document container */}
							<div
								className="flex max-w-[70%] w-full items-center justify-center shadow-2xl rounded-xl overflow-clip"
								ref={onRefChange}
							>
								{instance.loading ? (
									<div>Loading Preview...</div>
								) : (
									<Document file={instance.url}>
										<Page
											pageNumber={1}
											/* 4. Pass the measured width here */
											/* We subtract a small amount (e.g. 2px) to prevent sub-pixel overflow scrollbars */
											width={containerWidth}
											renderTextLayer={false}
											renderAnnotationLayer={false}
										/>
									</Document>
								)}
							</div>

							{/* buttons and details */}
							<div className="max-w-[30%] w-f h-full w-full bg-white rounded-xl p-4">
								<h2 className="font-mono font-semibold text-xs text-accent-foreground/50">
									TRANSACTION DETAILS
								</h2>

								{/* deatils container */}
								<div className="px-2 py-4">
									{/* network */}
									<div className="flex justify-between bg-accent p-4 border border-b-accent-foreground/20">
										<p className="font-mono text-xs">
											Network
										</p>

										<div className="flex items-center gap-2">
											<div className="size-2 rounded-full bg-green-400" />
											<p className="font-mono text-xs">
												Sepolia
											</p>
										</div>
									</div>

									{/* gas fee */}
									<div className="flex justify-between bg-accent p-4">
										<p className="font-mono text-xs">
											Est. Gast Cost
										</p>

										<div className="flex items-center gap-2">
											<p className="font-mono text-xs">
												0.00034 ETH
											</p>
										</div>
									</div>
								</div>

								{/* Actions button container */}
								<div className="flex flex-col gap-4">
									<h3 className="font-mono text-xs text-accent-foreground/50">
										Actions
									</h3>

									<Button
										variant={"default"}
										className="bg-button-primary w-full shadow-2xl"
									>
										Issue Credential
									</Button>

									<Button
										variant={"ghost"}
										className=" w-full shadow-2xl border border-accent-foreground/30"
									>
										Back
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
