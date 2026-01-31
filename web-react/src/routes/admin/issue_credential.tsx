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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Eye, FileStack, Loader } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/admin/issue_credential")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const { getPreview } = usePdfStore();
	const { createRecord } = useRecordStore();

	const navigate = useNavigate();

	const [containerWidth, setContainerWidth] = useState<number>();
	const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// Resize observer logic (Unchanged)
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (resizeTimeoutRef.current) {
					clearTimeout(resizeTimeoutRef.current);
				}
				resizeTimeoutRef.current = setTimeout(() => {
					if (entries[0]) {
						const newWidth = entries[0].contentRect.width;
						setContainerWidth((prevWidth) => {
							if (
								!prevWidth ||
								Math.abs(prevWidth - newWidth) > 5
							) {
								return newWidth;
							}
							return prevWidth;
						});
					}
				}, 100);
			});
			resizeObserver.observe(node);
			return () => {
				resizeObserver.disconnect();
				if (resizeTimeoutRef.current)
					clearTimeout(resizeTimeoutRef.current);
			};
		}
	}, []);

	const [numPages, setNumPages] = useState<number>();
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null,
	);
	const [selectedCredentialType, setSelectedCredentialType] =
		useState<CredentialType | null>(null);

	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			selectedStudent?.id,
			selectedCredentialType?.id,
		],
		queryFn: () =>
			getPreview(selectedStudent!.id, selectedCredentialType!.name),
		enabled: !!selectedStudent && !!selectedCredentialType,
		staleTime: 1000 * 60 * 5,
	});

	const { mutate, isPending: isCreating } = useMutation({
		mutationFn: () => {
			if (!selectedStudent || !selectedCredentialType)
				throw new Error("Missing selection");
			return createRecord(selectedStudent.id, selectedCredentialType.id);
		},
		onSuccess: (newRecord) => {
			navigate({
				to: "/admin/sucess_issue",
				search: { recordId: newRecord.id },
			});
			queryClient.invalidateQueries({ queryKey: ["records"] });
		},
		onError: (error) => console.error(error),
	});

	const documentKey = useMemo(() => {
		if (!pdfBlob) return null;
		return `${selectedStudent?.id}-${selectedCredentialType?.id}`;
	}, [pdfBlob, selectedStudent?.id, selectedCredentialType?.id]);

	return (
		<div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-slate-900">
			{/* Added responsive padding (px-4 for mobile, px-8 for desktop) */}
			<div className="px-4 py-6 md:px-8 md:py-8 flex flex-col flex-1 justify-start gap-6 max-w-[1600px] mx-auto w-full">
				{/* Title Section */}
				<div className="flex flex-col gap-1 mb-2">
					<h3 className="font-extrabold text-2xl tracking-tight text-slate-900">
						Issue New Credential
					</h3>
					<p className="text-slate-500 text-sm">
						Select a student and template to generate a blockchain
						record.
					</p>
				</div>

				{/* Main Grid: Stacks on mobile (grid-cols-1), Splits on Large (lg:grid-cols-12) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full lg:min-h-[600px]">
					{/* Left Sidebar: Triggers */}
					{/* Takes full width on mobile, 3 cols on desktop */}
					<div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
						<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 sticky top-4">
							<h4 className="font-bold text-xs tracking-widest text-slate-500 uppercase mb-2">
								Configuration
							</h4>
							<StudentSelector
								onSelectStudent={setSelectedStudent}
							/>
							<CredentialTypeSelector
								onSelectCredential={setSelectedCredentialType}
							/>
						</div>
					</div>

					{/* Right Area: Preview & Actions */}
					{/* Takes full width on mobile, 9 cols on desktop */}
					{/* Flex direction switches: Column on mobile, Row on desktop */}
					<div className="col-span-1 lg:col-span-9 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col lg:flex-row overflow-hidden">
						{/* A. Document Preview Container */}
						{/* Added min-height for mobile so it doesn't collapse */}
						<div className="flex-1 flex flex-col bg-slate-100/50 relative border-b lg:border-b-0 lg:border-r border-slate-100 min-h-[400px]">
							{/* Watermark/Label */}
							{pdfBlob && (
								<div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
									<Eye className="size-3 text-indigo-600" />
									<p className="font-bold text-[10px] text-slate-600 uppercase tracking-wide">
										Live Preview
									</p>
								</div>
							)}

							<div className="flex-1 flex justify-center items-center overflow-hidden p-4 md:p-8 relative">
								<div
									className={cn(
										"relative flex w-full max-w-[90%] items-center justify-center shadow-xl rounded-sm overflow-hidden bg-white transition-opacity duration-200",
										!pdfBlob &&
											"h-[300px] md:h-[500px] opacity-100",
									)}
									ref={onRefChange}
								>
									{isPreviewLoading && (
										<div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
											<Loader className="size-10 animate-spin text-indigo-600" />
										</div>
									)}

									{!isPreviewLoading && pdfBlob && (
										<Document
											key={documentKey}
											file={pdfBlob}
											className="flex justify-center"
											onLoadSuccess={({ numPages }) =>
												setNumPages(numPages)
											}
											loading={
												<div className="flex items-center justify-center w-full h-full py-20">
													<Loader className="size-10 animate-spin text-slate-300" />
												</div>
											}
										>
											<Page
												pageNumber={1}
												width={
													containerWidth
														? containerWidth
														: undefined
												}
												renderTextLayer={false}
												renderAnnotationLayer={false}
											/>
										</Document>
									)}

									{!isPreviewLoading && !pdfBlob && (
										<div className="flex flex-col items-center justify-center gap-4 text-slate-300 p-8">
											<div className="bg-slate-50 p-4 rounded-full">
												<FileStack className="size-8 md:size-10" />
											</div>
											<p className="font-medium text-xs md:text-sm text-center text-slate-400">
												Select a student and credential
												type
												<br />
												to generate a preview.
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* B. Right Sidebar: Transaction Details & Actions */}
						{/* Width is 100% on mobile, fixed 320px on desktop */}
						<div className="w-full lg:w-[320px] bg-white flex flex-col border-l-0 lg:border-l border-slate-100">
							<div className="p-6 border-b border-slate-100">
								<h2 className="font-bold text-xs tracking-widest text-slate-500 uppercase">
									Transaction Details
								</h2>
							</div>

							<div className="p-6 space-y-6 flex-1">
								<div className="space-y-4">
									<div className="flex justify-between items-center group">
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Network
										</p>
										<div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded border border-green-100">
											<div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
											<p className="font-semibold text-xs text-green-700">
												Sepolia
											</p>
										</div>
									</div>

									<div className="flex justify-between items-center">
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Est. Gas Cost
										</p>
										<p className="font-mono text-xs font-semibold text-slate-700">
											0.00034 ETH
										</p>
									</div>

									<div className="h-px bg-slate-100 w-full my-2" />

									<div className="flex gap-2 items-start">
										<CheckCircle2 className="size-4 text-slate-400 mt-0.5" />
										<p className="text-xs text-slate-500 leading-relaxed">
											This record will be permanently
											hashed and anchored to the
											blockchain.
										</p>
									</div>
								</div>
							</div>

							<div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
								<Button
									variant={"default"}
									className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-sm font-semibold"
									onClick={() => mutate()}
									disabled={
										isCreating ||
										!selectedStudent ||
										!selectedCredentialType
									}
								>
									{isCreating ? (
										<div className="flex gap-2 items-center justify-center">
											<Spinner className="text-white" />
											<span>Minting...</span>
										</div>
									) : (
										"Issue Credential"
									)}
								</Button>

								<Button
									variant={"outline"}
									className="w-full h-11 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900"
									onClick={() => navigate({ to: ".." })}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
