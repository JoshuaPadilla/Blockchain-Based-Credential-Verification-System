import { Button } from "@/components/ui/button";

// 1. Import the Generator Hook

// 2. Import the Viewer Components (Wojtek Maj)
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// 3. Setup the Worker (Mandatory for Wojtek's lib)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

import { CredentialTypeSelector } from "@/components/custom_components/credential_type_selector";
import { StudentSelector } from "@/components/custom_components/student_selector";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import type { CredentialType } from "@/types/credential_type.type";
import type { Student } from "@/types/student.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileStack, Loader } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

// Assuming DiplomaPDF is your component built with @react-pdf/renderer primitives

export const Route = createFileRoute("/admin/issue_credential")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const { getPreview } = usePdfStore();
	const { createRecord } = useRecordStore();

	const [containerWidth, setContainerWidth] = useState<number>();
	const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				// Clear any pending timeout
				if (resizeTimeoutRef.current) {
					clearTimeout(resizeTimeoutRef.current);
				}

				// Debounce the width update
				resizeTimeoutRef.current = setTimeout(() => {
					if (entries[0]) {
						const newWidth = entries[0].contentRect.width;
						setContainerWidth((prevWidth) => {
							// Only update if width changed significantly (more than 5px)
							if (
								!prevWidth ||
								Math.abs(prevWidth - newWidth) > 5
							) {
								return newWidth;
							}
							return prevWidth;
						});
					}
				}, 100); // 100ms debounce
			});

			resizeObserver.observe(node);

			return () => {
				resizeObserver.disconnect();
				if (resizeTimeoutRef.current) {
					clearTimeout(resizeTimeoutRef.current);
				}
			};
		}
	}, []);

	// 'instance' contains the blob, url, and loading state

	const [numPages, setNumPages] = useState<number>();
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null,
	);
	const [selectedCredentialType, setSelectedCredentialType] =
		useState<CredentialType | null>(null);

	// pdf query
	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			selectedStudent?.id,
			selectedCredentialType?.id,
		],
		queryFn: () =>
			getPreview(selectedStudent!.id, selectedCredentialType!.name),
		enabled: !!selectedStudent && !!selectedCredentialType, // Only run if both are selected
		staleTime: 1000 * 60 * 5, // Cache the preview for 5 mins
	});

	const { mutate, isPending: isCreating } = useMutation({
		mutationFn: () => {
			if (!selectedStudent || !selectedCredentialType)
				throw new Error("Missing selection");
			return createRecord(selectedStudent.id, selectedCredentialType.id);
		},
		onSuccess: (newRecord) => {
			console.log("Credential Issued successfully!");
			// Invalidate the 'records' list so other parts of the app refresh
			queryClient.invalidateQueries({ queryKey: ["records"] });
			console.log("Record Created:", newRecord);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	// Create a stable key for the Document component to prevent unnecessary re-renders
	const documentKey = useMemo(() => {
		if (!pdfBlob) return null;
		return `${selectedStudent?.id}-${selectedCredentialType?.id}`;
	}, [pdfBlob, selectedStudent?.id, selectedCredentialType?.id]);

	return (
		<>
			<div className=" px-16 py-8 flex flex-col flex-1 justify-start gap-4 ">
				{/* Title */}
				<h3 className="font-mono font-extrabold text-3xl">
					Issue New Credential
				</h3>

				{/* Main content */}
				<div className="grid grid-cols-8 grid-rows-2 gap-2 w-full h-full">
					{/* Triggers */}
					<div className="col-start-1 col-span-2 row-start-1 row-span-2 flex flex-col gap-2">
						<StudentSelector onSelectStudent={setSelectedStudent} />

						<CredentialTypeSelector
							onSelectCredential={setSelectedCredentialType}
						/>
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
							{pdfBlob && (
								<Button asChild>
									<a
										href={URL.createObjectURL(pdfBlob)}
										download="credential.pdf"
									>
										Download PDF
									</a>
								</Button>
							)}
						</div>

						{/* preview and buttons */}
						<div className="flex-1 flex justify-center items-center overflow-hidden w-full h-full p-4 gap-4">
							{/* Document container */}
							<div
								className={cn(
									"flex max-w-[70%] w-full items-center justify-center shadow-2xl rounded-md overflow-clip ",
									!pdfBlob && "h-full",
									"transition-opacity duration-200",
								)}
								ref={onRefChange}
							>
								{/* Show loader ONLY when loading */}
								{isPreviewLoading && (
									<div className="flex items-center justify-center w-full h-full">
										<Loader
											role="status"
											aria-label="Loading"
											className="size-12 animate-spin"
										/>
									</div>
								)}

								{/* Show PDF ONLY when not loading AND pdfUrl exists */}

								{/* B. PDF STATE vs EMPTY STATE */}
								{!isPreviewLoading && pdfBlob && (
									<Document
										key={documentKey}
										file={pdfBlob}
										className="flex justify-center"
										onLoadSuccess={({ numPages }) =>
											setNumPages(numPages)
										}
										loading={
											<div className="flex items-center justify-center w-full h-full">
												<Loader className="size-12 animate-spin" />
											</div>
										}
									>
										<Page
											pageNumber={1}
											width={
												containerWidth
													? containerWidth - 4
													: undefined
											}
											renderTextLayer={false}
											renderAnnotationLayer={false}
										/>
									</Document>
								)}

								{/* Show empty state ONLY when not loading AND no pdfUrl */}
								{!isPreviewLoading && !pdfBlob && (
									<div className="flex flex-col items-center justify-center gap-2 text-muted-foreground opacity-50">
										<FileStack className="size-12" />
										<p className="font-mono text-sm text-center px-8">
											Select a student and credential type
											<br />
											to generate a preview.
										</p>
									</div>
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
										onClick={() => mutate()}
										disabled={isCreating}
									>
										{isCreating ? (
											<div className="flex gap-2 items-center justify-center">
												<Spinner data-icon="inline-start" />
												Submitting
											</div>
										) : (
											"Issue Credential"
										)}
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
