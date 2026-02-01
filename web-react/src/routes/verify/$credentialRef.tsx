import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertTriangle,
	Ban,
	CheckCircle2,
	Clock,
	Copy,
	Download,
	ExternalLink,
	FileX,
	Loader,
	SearchX,
	ShieldAlert,
	ShieldCheck,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// --- Worker Setup ---
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

// --- Types & Enums ---
// Mapping your backend enum to frontend logic
const VERIFICATION_STATUS = {
	VALID: "verified",
	REVOKED: "revoked",
	EXPIRED: "expired",
	TAMPERED: "tampered",
	PENDING: "pending",
	NOT_FOUND: "not_found",
} as const;

// --- Helper: UI Configuration based on Status ---
// This handles the color coding and iconography for every state
const getStatusConfig = (statuses: string[]) => {
	// Priority check: Tampered > Revoked > Expired > Pending > Valid
	if (statuses.includes(VERIFICATION_STATUS.TAMPERED)) {
		return {
			theme: "red",
			icon: ShieldAlert,
			title: "Integrity Check Failed",
			description:
				"This record's data hash does not match the blockchain anchor. It may have been altered.",
			bg: "bg-red-50",
			border: "border-red-200",
			text: "text-red-700",
			iconColor: "text-red-600",
			badge: "bg-red-100 text-red-700",
		};
	}
	if (statuses.includes(VERIFICATION_STATUS.REVOKED)) {
		return {
			theme: "red",
			icon: Ban,
			title: "Credential Revoked",
			description:
				"The issuing institution has explicitly revoked this credential.",
			bg: "bg-red-50",
			border: "border-red-200",
			text: "text-red-700",
			iconColor: "text-red-600",
			badge: "bg-red-100 text-red-700",
		};
	}
	if (statuses.includes(VERIFICATION_STATUS.EXPIRED)) {
		return {
			theme: "orange",
			icon: Clock,
			title: "Credential Expired",
			description:
				"This credential is no longer valid as of the expiration date.",
			bg: "bg-orange-50",
			border: "border-orange-200",
			text: "text-orange-700",
			iconColor: "text-orange-600",
			badge: "bg-orange-100 text-orange-700",
		};
	}
	if (statuses.includes(VERIFICATION_STATUS.PENDING)) {
		return {
			theme: "amber",
			icon: AlertTriangle,
			title: "Issuance Pending",
			description:
				"This record is anchored but waiting for all required signatures.",
			bg: "bg-amber-50",
			border: "border-amber-200",
			text: "text-amber-700",
			iconColor: "text-amber-600",
			badge: "bg-amber-100 text-amber-700",
		};
	}

	// Default: Valid (If statuses array is empty or contains verified)
	return {
		theme: "green",
		icon: ShieldCheck,
		title: "Officially Verified",
		description:
			"The academic record is authentic, active, and has not been altered.",
		bg: "bg-green-50",
		border: "border-green-200",
		text: "text-green-700",
		iconColor: "text-green-600",
		badge: "bg-green-100 text-green-700",
	};
};

// --- Route Definition ---
export const Route = createFileRoute("/verify/$credentialRef")({
	component: VerificationPage,
	loader: async ({ params }) => {
		// We access the store directly here to fetch data before render
		// Note: In a real app, ensure useRecordStore.getState().verifyRecord is available
		// or import the store hook properly if using inside component.
		// Assuming 'verifyRecord' is available via a hook or direct import.
		// For this example, we'll use the store hook inside the component for simplicity,
		// OR if you want to preload, you need the store instance.
		// Let's rely on the component using the hook for now to match your pattern.
		return { credentialRef: params.credentialRef };
	},
});

function VerificationPage() {
	const { credentialRef } = Route.useLoaderData();
	const { verifyRecord } = useRecordStore();
	const { getPreview } = usePdfStore();
	const navigate = useNavigate();

	// 1. Fetch Verification Data
	const {
		data: verificationData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["verify", credentialRef],
		queryFn: async () => {
			const data = await verifyRecord(credentialRef);
			if (!data) throw new Error("Not Found");
			return data;
		},
		retry: false, // Don't retry if 404
	});

	// 2. Fetch PDF Preview (Only if record exists and NOT tampered)
	const shouldFetchPdf =
		verificationData?.record &&
		!verificationData.statuses.includes(VERIFICATION_STATUS.TAMPERED);

	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			verificationData?.record?.student?.id,
			verificationData?.record?.credentialType?.name,
		],
		queryFn: () =>
			getPreview(
				verificationData!.record.student.id,
				verificationData!.record.credentialType.name,
			),
		enabled: !!shouldFetchPdf,
		staleTime: 1000 * 60 * 60,
	});

	// 3. Resize Observer for PDF
	const [containerWidth, setContainerWidth] = useState<number>();
	const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (resizeTimeoutRef.current)
					clearTimeout(resizeTimeoutRef.current);
				resizeTimeoutRef.current = setTimeout(() => {
					if (entries[0])
						setContainerWidth(entries[0].contentRect.width);
				}, 100);
			});
			resizeObserver.observe(node);
			return () => resizeObserver.disconnect();
		}
	}, []);

	// --- Loading State ---
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-400">
				<div className="flex flex-col items-center gap-4">
					<Loader className="size-10 animate-spin text-indigo-600" />
					<p className="text-sm font-medium">
						Verifying Credential on Blockchain...
					</p>
				</div>
			</div>
		);
	}

	// --- Not Found State ---
	if (isError || !verificationData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
				<div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
					<div className="mx-auto size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
						<SearchX className="size-8 text-slate-400" />
					</div>
					<h2 className="text-xl font-bold text-slate-900 mb-2">
						Credential Not Found
					</h2>
					<p className="text-slate-500 text-sm mb-6">
						We could not locate a credential with the reference ID{" "}
						<span className="font-mono bg-slate-100 px-1 rounded">
							{credentialRef}
						</span>
						. It may be invalid or does not exist.
					</p>
					<Button
						onClick={() => navigate({ to: "/" })}
						className="w-full"
					>
						Return to Home
					</Button>
				</div>
			</div>
		);
	}

	// --- Prepare UI Config ---
	const config = getStatusConfig(verificationData.statuses);
	const record = verificationData.record;
	const isTampered = verificationData.statuses.includes(
		VERIFICATION_STATUS.TAMPERED,
	);

	return (
		<div className="min-h-screen bg-gray-50/50 flex flex-col items-center py-12 px-4 sm:px-8 gap-8 font-sans text-slate-900">
			{/* --- Top Header (Dynamic) --- */}
			<div className="flex flex-col items-center text-center gap-4">
				<div className={`rounded-full p-4 ${config.bg}`}>
					<config.icon
						className={`size-8 ${config.iconColor}`}
						strokeWidth={3}
					/>
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						{config.title}
					</h1>
					<p
						className={`max-w-lg mx-auto font-medium ${config.text}`}
					>
						{config.description}
					</p>
				</div>
			</div>

			{/* --- Main Grid Layout --- */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl">
				{/* --- Left Column: Verification Details (Cols 1-4) --- */}
				<div className="lg:col-span-4 space-y-6">
					<div
						className={`bg-white rounded-xl shadow-sm border ${config.border} overflow-hidden`}
					>
						<div className="p-6 space-y-6">
							{/* Header */}
							<div className="flex items-center gap-2 mb-2">
								<ShieldCheck
									className={`size-5 ${config.iconColor}`}
								/>
								<h3 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
									Verification Data
								</h3>
							</div>

							{/* Status Tags */}
							<div className="flex flex-wrap gap-2">
								{verificationData.statuses.length === 0 && (
									<span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 uppercase">
										Verified
									</span>
								)}
								{verificationData.statuses.map((status) => (
									<span
										key={status}
										className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${
											status === "verified"
												? "bg-green-100 text-green-700 border-green-200"
												: status === "pending"
													? "bg-amber-100 text-amber-700 border-amber-200"
													: "bg-red-100 text-red-700 border-red-200"
										}`}
									>
										{status}
									</span>
								))}
							</div>

							{/* Technical Details (Only show if Record exists) */}
							{record ? (
								<>
									<div className="space-y-1.5">
										<label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Transaction Hash
										</label>
										<div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100 group">
											<code className="text-xs text-slate-600 truncate flex-1 font-mono">
												{record.txHash}
											</code>
											<button
												className="text-slate-400 hover:text-indigo-600 transition-colors"
												onClick={() =>
													navigator.clipboard.writeText(
														record.txHash,
													)
												}
											>
												<Copy className="size-4" />
											</button>
										</div>
										<a
											href="#"
											className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline mt-1"
										>
											View on Block Explorer{" "}
											<ExternalLink className="size-3" />
										</a>
									</div>

									<div className="h-px bg-slate-100 w-full" />

									{/* Student Info */}
									<div className="space-y-3">
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Issued To
										</p>
										<div className="flex items-center gap-3">
											<div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
												{record.student?.firstName?.charAt(
													0,
												) || "S"}
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-bold text-slate-900">
													{record.student?.firstName}{" "}
													{record.student?.middleName}{" "}
													{record.student?.lastName}
												</span>
												<span className="text-xs text-slate-500 font-mono">
													ID:{" "}
													{record.student?.student_id}
												</span>
											</div>
										</div>
									</div>
								</>
							) : (
								// Fallback if Record is null (Tampered)
								<div className="p-4 bg-red-50 rounded border border-red-100 text-xs text-red-600">
									<FileX className="size-5 mb-2" />
									Technical details are hidden because the
									data integrity check failed.
								</div>
							)}
						</div>
					</div>
				</div>

				{/* --- Right Column: Preview (Cols 5-12) --- */}
				<div className="lg:col-span-8 flex flex-col h-full min-h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
					{/* Preview Header */}
					<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h3 className="font-bold text-xs tracking-widest text-slate-500 uppercase">
							Digital Certificate Preview
						</h3>
						{/* Only allow download if not tampered */}
						{!isTampered && pdfBlob && (
							<Button
								variant="ghost"
								size="sm"
								className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 text-xs font-semibold"
								onClick={() => {
									const url =
										window.URL.createObjectURL(pdfBlob);
									const link = document.createElement("a");
									link.href = url;
									link.download = `credential-${credentialRef}.pdf`;
									link.click();
								}}
							>
								<Download className="size-4 mr-2" /> Download
								PDF
							</Button>
						)}
					</div>

					{/* Preview Area */}
					<div className="flex-1 bg-slate-100/50 relative p-8 flex flex-col items-center justify-center overflow-hidden">
						<div
							ref={onRefChange}
							className="w-full h-full flex items-center justify-center shadow-2xl rounded-sm max-w-[90%] relative bg-white"
						>
							{isPreviewLoading && (
								<div className="flex flex-col items-center gap-2">
									<Loader className="animate-spin text-slate-400 size-8" />
									<span className="text-xs text-slate-400">
										Loading Document...
									</span>
								</div>
							)}

							{/* Show PDF if exists and clean */}
							{!isPreviewLoading && pdfBlob && !isTampered && (
								<Document
									file={pdfBlob}
									className="flex justify-center shadow-lg"
									loading={
										<Loader className="animate-spin text-slate-400 size-10" />
									}
								>
									<Page
										pageNumber={1}
										width={
											containerWidth
												? containerWidth
												: 600
										}
										renderTextLayer={false}
										renderAnnotationLayer={false}
										className="shadow-xl"
									/>
								</Document>
							)}

							{/* Error State for Preview */}
							{!isPreviewLoading && isTampered && (
								<div className="flex flex-col items-center text-center max-w-sm p-6">
									<FileX className="size-12 text-red-300 mb-4" />
									<h3 className="text-slate-900 font-bold">
										Preview Unavailable
									</h3>
									<p className="text-slate-500 text-sm mt-2">
										The document preview has been disabled
										because the record integrity check
										failed.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* --- Footer --- */}
			<div className="w-full max-w-7xl flex justify-between text-[10px] text-slate-400 pt-8 border-t border-slate-200/60 mt-auto">
				<div className="flex items-center gap-1.5">
					<CheckCircle2 className="size-3 text-slate-400" />
					Blockchain Verification Protocol • SHA-256 Checksum
				</div>
				<div>Secure Credential Verification System</div>
			</div>
		</div>
	);
}
