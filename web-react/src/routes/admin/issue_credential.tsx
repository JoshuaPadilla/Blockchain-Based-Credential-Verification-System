import { CredentialTypeSelector } from "@/components/custom_components/credential_type_selector";
import { PendingSpinner } from "@/components/custom_components/pending_spinner";
import { StudentSelector } from "@/components/custom_components/student_selector";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import type { CredentialType } from "@/types/credential_type.type";
import type { Student } from "@/types/student.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	FileSignature,
	FileStack,
	Fuel,
	Globe,
	Loader,
	Settings2,
	ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
// 1. Import Viewer Components
import { pdfBlobToDataUrl } from "@/helpers/pdf_helper";

// 2. Worker Setup

const STANDARD_OPTIONS = {
	// ✅ CORRECT: Forces browser to look at domain root
	cMapUrl: "/cmaps/",
	cMapPacked: true,
	standardFontDataUrl: "/standard_fonts/",
};

export const Route = createFileRoute("/admin/issue_credential")({
	component: RouteComponent,
	pendingComponent: () => <PendingSpinner />,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const { getPreview } = usePdfStore();
	const { createRecord } = useRecordStore();
	const navigate = useNavigate();

	const [previewImage, setPreviewImage] = useState<string | null>(null);

	// --- State ---
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null,
	);
	const [selectedCredentialType, setSelectedCredentialType] =
		useState<CredentialType | null>(null);

	// --- Queries & Mutations ---
	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			selectedStudent?.id,
			selectedCredentialType?.id,
		],
		queryFn: () =>
			getPreview(selectedStudent!.id, selectedCredentialType!.name),
		// 🛑 ADD THESE LINES TO STOP THE LOOP 🛑
		enabled: !!(selectedStudent && selectedCredentialType), // ⭐ ADD THIS
		staleTime: Infinity,
		gcTime: 1000 * 60 * 30,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false, // ⭐ ADD THIS
		retry: 1,
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

	// --- Resize Observer (Responsive PDF) ---

	useEffect(() => {
		let active = true;

		if (pdfBlob) {
			pdfBlobToDataUrl(pdfBlob)
				.then((base64Image) => {
					if (active) {
						setPreviewImage(base64Image);
						console.log(
							"Generated DataURL:",
							base64Image.slice(0, 50) + "...",
						);
					}
				})
				.catch((err) => console.error("PDF Conversion Failed", err));
		}

		return () => {
			active = false;
		};
	}, [pdfBlob]);

	// --- Render ---
	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
			{/* Header / Breadcrumb Area */}
			<div className="bg-white border-b border-slate-200 px-4 py-6 md:px-8">
				<div className="max-w-[1600px] mx-auto w-full flex items-center gap-3">
					<div className="size-10 bg-[var(--button-primary)] rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
						<FileSignature className="size-5" />
					</div>
					<div>
						<h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-slate-900">
							Issue New Credential
						</h1>
						<p className="text-slate-500 text-sm font-medium">
							Configure parameters to mint a new blockchain
							record.
						</p>
					</div>
				</div>
			</div>

			<div className="px-4 py-8 md:px-8 flex-1 max-w-400 mx-auto w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
					{/* --- LEFT COL: Configuration --- */}
					<div className="lg:col-span-3 space-y-6">
						<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-8">
							<div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
								<Settings2 className="size-4 text-slate-500" />
								<h4 className="font-bold text-xs tracking-widest text-slate-500 uppercase">
									Configuration
								</h4>
							</div>

							<div className="p-4 space-y-5">
								<div className="space-y-3">
									<label className="text-sm font-semibold text-slate-700">
										Select Student
									</label>
									<StudentSelector
										onSelectStudent={setSelectedStudent}
									/>
									{selectedStudent && (
										<div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-100">
											<CheckCircle2 className="size-3 text-green-500" />
											<span>
												ID:{" "}
												<span className="font-mono">
													{selectedStudent.student_id}
												</span>
											</span>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<label className="text-sm font-semibold text-slate-700">
										Credential Type
									</label>
									<CredentialTypeSelector
										onSelectCredential={
											setSelectedCredentialType
										}
									/>
								</div>

								{/* Info Box */}
								<div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 items-start">
									<AlertCircle className="size-4 text-blue-600 mt-0.5 shrink-0" />
									<p className="text-xs text-blue-700 leading-relaxed">
										Ensure data is correct. Once minted, the
										anchor hash cannot be modified on the
										blockchain.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* --- RIGHT AREA: Preview & Transaction --- */}
					<div className="lg:col-span-9 flex flex-col lg:flex-row bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
						{/* 1. Document Preview Area (Expands) */}
						<div className="flex-1 flex flex-col relative bg-slate-100/50">
							{/* Live Preview Badge */}
							<div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
								<Eye className="size-3 text-[var(--button-primary)]" />
								<span className="font-bold text-[10px] text-slate-600 uppercase tracking-wide">
									Live Preview
								</span>
							</div>

							<div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
								<div
									className={cn(
										"relative flex w-full max-w-3xl items-center justify-center transition-all duration-300",
										!pdfBlob
											? "opacity-100"
											: "opacity-100", // Always visible container
									)}
								>
									{/* Loading State */}
									{isPreviewLoading && (
										<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-20 rounded-lg">
											<Loader className="size-8 animate-spin text-[var(--button-primary)] mb-2" />
											<p className="text-xs font-medium text-slate-500">
												Generating Preview...
											</p>
										</div>
									)}

									{/* PDF Render */}
									{!isPreviewLoading && pdfBlob && (
										<div className="shadow-xl rounded-sm overflow-hidden border border-slate-200/60">
											{!isPreviewLoading &&
											previewImage ? (
												<div className="shadow-xl rounded-sm overflow-hidden border border-slate-200/60">
													<img
														src={previewImage}
														alt="Certificate Preview"
														className="w-full h-auto object-contain" // w-full handles the width automatically
													/>
												</div>
											) : (
												// Fallback or Loading state
												<div className="...loading styles...">
													Generating Image...
												</div>
											)}
										</div>
									)}

									{/* Empty State */}
									{!isPreviewLoading && !pdfBlob && (
										<div className="flex flex-col items-center justify-center gap-4 text-slate-300 py-12">
											<div className="size-20 rounded-full bg-slate-100 flex items-center justify-center mb-2">
												<FileStack className="size-10 text-slate-300" />
											</div>
											<div className="text-center space-y-1">
												<h3 className="text-slate-900 font-semibold">
													No Preview Available
												</h3>
												<p className="text-sm text-slate-500 max-w-xs mx-auto">
													Select a student and
													credential template from the
													configuration panel to
													generate a preview.
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* 2. Transaction Sidebar (Fixed Width on Desktop) */}
						<div className="w-full lg:w-[340px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col z-10">
							<div className="p-6 border-b border-slate-100">
								<h2 className="font-bold text-xs tracking-widest text-slate-500 uppercase flex items-center gap-2">
									<ShieldCheck className="size-4" />{" "}
									Transaction Summary
								</h2>
							</div>

							<div className="p-6 flex-1 space-y-6">
								{/* Network Stats */}
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
											<Globe className="size-3.5" />{" "}
											Network
										</div>
										<div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
											<div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
											<span className="font-bold text-[10px] text-green-700 uppercase tracking-wide">
												Sepolia Testnet
											</span>
										</div>
									</div>

									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
											<Fuel className="size-3.5" /> Est.
											Gas Fee
										</div>
										<span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
											~0.00034 ETH
										</span>
									</div>
								</div>

								<div className="h-px bg-slate-100 w-full" />

								{/* Summary of Selection */}
								<div className="space-y-3">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										To be minted
									</p>

									<div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
										<div className="flex justify-between">
											<span className="text-xs text-slate-500">
												Recipient:
											</span>
											<span className="text-xs font-bold text-slate-900 text-right truncate max-w-[120px]">
												{selectedStudent
													? `${selectedStudent.firstName} ${selectedStudent.lastName}`
													: "—"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-xs text-slate-500">
												Type:
											</span>
											<span className="text-xs font-bold text-slate-900 text-right truncate max-w-[120px]">
												{selectedCredentialType?.name ||
													"—"}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
								<Button
									variant="default"
									className="w-full h-12 bg-[var(--button-primary)] hover:opacity-90 shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all"
									onClick={() => mutate()}
									disabled={
										isCreating ||
										!selectedStudent ||
										!selectedCredentialType
									}
								>
									{isCreating ? (
										<>
											<Spinner className="mr-2 h-4 w-4 text-white" />
											Anchoring Record...
										</>
									) : (
										"Issue Credential"
									)}
								</Button>

								<Button
									variant="ghost"
									className="w-full h-10 text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200"
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
