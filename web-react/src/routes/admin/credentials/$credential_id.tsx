import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	ArrowUpRight,
	Ban,
	Calendar,
	Clock,
	Copy,
	Download,
	FileCheck,
	FileText,
	Fingerprint,
	Hash,
	Loader2,
	Maximize2,
	Shield,
	ShieldAlert,
	ShieldCheck,
	User,
	ZoomIn,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";

// --- Worker Setup ---
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

export const Route = createFileRoute("/admin/credentials/$credential_id")({
	component: CredentialDetail,
	loader: async ({ params }) => {
		return { credential_id: params.credential_id };
	},
});

function CredentialDetail() {
	const { credential_id } = Route.useLoaderData();
	const { getRecord, revokeRecord } = useRecordStore();
	const { getPreview } = usePdfStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleRevokeRecord = async (credentialRef: string) => {
		if (
			confirm(
				"Are you sure you want to revoke this credential? This action cannot be undone.",
			)
		) {
			await revokeRecord(credentialRef);
			queryClient.invalidateQueries({ queryKey: ["record"] });
			toast.success("Credential revoked successfully");
		}
	};

	// 1. Fetch Record Data
	const {
		data: record,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["record", credential_id],
		queryFn: () => getRecord(credential_id),
		retry: false,
	});

	// 2. Fetch PDF Preview
	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			record?.student?.id,
			record?.credentialType?.name,
		],
		queryFn: () =>
			getPreview(record!.student.id, record!.credentialType.name),
		enabled: !!record,
		staleTime: 1000 * 60 * 60,
	});

	// 3. Resize Logic
	const [containerWidth, setContainerWidth] = useState<number>();
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (entries[0]) {
					setContainerWidth(entries[0].contentRect.width - 48); // 48px padding buffer
				}
			});
			resizeObserver.observe(node);
			return () => resizeObserver.disconnect();
		}
	}, []);

	// --- Loading State ---
	if (isLoading) {
		return (
			<div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
				<div className="p-4 bg-white rounded-full shadow-lg border border-slate-100">
					<Loader2 className="size-8 animate-spin text-blue-600" />
				</div>
				<p className="text-sm font-medium text-slate-500 animate-pulse">
					Retrieving Registry Record...
				</p>
			</div>
		);
	}

	// --- Error State ---
	if (isError || !record) {
		return (
			<div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-4">
				<div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
					<div className="bg-red-50 size-16 rounded-full flex items-center justify-center mx-auto mb-6">
						<AlertCircle className="size-8 text-red-500" />
					</div>
					<h2 className="text-xl font-bold text-slate-900 mb-2">
						Record Unavailable
					</h2>
					<p className="text-slate-500 mb-6">
						The credential ID provided does not exist in the
						registry or you lack the necessary permissions.
					</p>
					<Button
						onClick={() => navigate({ to: ".." })}
						className="w-full"
					>
						<ArrowLeft className="mr-2 size-4" /> Return to Registry
					</Button>
				</div>
			</div>
		);
	}

	const isRevoked = record.revoked;
	const isPending =
		record.currentSignatures <
		record.credentialType.requiredSignaturesCount;

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied`);
	};

	const downloadPdf = () => {
		if (pdfBlob) {
			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${record.credentialType.name}-${record.student.lastName}.pdf`;
			link.click();
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-50/50 font-sans text-slate-900">
			{/* --- Top Navigation Bar --- */}
			<header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate({ to: "/admin/credentials" })}
						className="text-slate-500 hover:text-slate-900 -ml-2"
					>
						<ArrowLeft className="mr-2 size-4" />
						Back
					</Button>
					<div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />
					<div className="flex flex-col">
						<h1 className="text-sm font-semibold text-slate-900 leading-none">
							{record.credentialType.name}
						</h1>
						<span className="text-[11px] font-mono text-slate-400 mt-1">
							ID: {record.credentialRef}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{!isRevoked && (
						<Button
							variant="outline"
							size="sm"
							className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 hidden sm:flex"
							onClick={() =>
								handleRevokeRecord(record.credentialRef)
							}
						>
							<Ban className="mr-2 size-3.5" /> Revoke
						</Button>
					)}
					<Button
						size="sm"
						onClick={downloadPdf}
						disabled={!pdfBlob}
						className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10"
					>
						<Download className="mr-2 size-3.5" />
						<span className="hidden sm:inline">Download PDF</span>
						<span className="sm:hidden">PDF</span>
					</Button>
				</div>
			</header>

			{/* --- Main Workspace Grid --- */}
			<main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* --- LEFT COLUMN: Record Manifest (Metadata) --- */}
				<div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
					{/* Status Card */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-1">
						<div
							className={`
                px-4 py-3 rounded-lg border flex items-center justify-between
                ${
					isRevoked
						? "bg-red-50 border-red-100 text-red-700"
						: isPending
							? "bg-amber-50 border-amber-100 text-amber-700"
							: "bg-emerald-50 border-emerald-100 text-emerald-700"
				}
             `}
						>
							<div className="flex items-center gap-3">
								{isRevoked ? (
									<ShieldAlert className="size-5" />
								) : isPending ? (
									<Loader2 className="size-5 animate-spin" />
								) : (
									<ShieldCheck className="size-5" />
								)}
								<div>
									<p className="text-xs font-bold uppercase tracking-wide">
										Status
									</p>
									<p className="text-sm font-semibold">
										{isRevoked
											? "Revoked"
											: isPending
												? "Pending Signatures"
												: "Active & Verified"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Student Details */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
						<div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
							<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
								<User className="size-3.5" /> Recipient
							</h3>
						</div>
						<div className="p-5">
							<div className="flex items-center gap-4 mb-6">
								<Avatar className="size-12 border border-slate-200">
									<AvatarImage
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.student.firstName}`}
									/>
									<AvatarFallback>
										{record.student.firstName[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-bold text-slate-900">
										{record.student.firstName}{" "}
										{record.student.lastName}
									</p>
									<p className="text-xs text-slate-500 font-mono">
										{record.student.student_id}
									</p>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center text-sm">
									<span className="text-slate-500">
										Program
									</span>
									<span
										className="font-medium text-slate-900 text-right max-w-[60%] truncate"
										title={record.student.course}
									>
										{record.student.course}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-slate-500">
										Year Level
									</span>
									<span className="font-medium text-slate-900">
										Year {record.student.yearLevel}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-slate-500">
										Email
									</span>
									<span
										className="text-slate-900 truncate max-w-[150px]"
										title={record.student.email}
									>
										{record.student.email || "-"}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Blockchain Proof */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
						<div className="px-5 py-4 border-b border-slate-100">
							<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
								<Shield className="size-3.5" /> Blockchain Proof
							</h3>
						</div>
						<div className="p-5 space-y-5">
							{/* Signatures */}
							<div className="space-y-2">
								<div className="flex justify-between items-baseline mb-1">
									<label className="text-[10px] font-bold text-slate-400 uppercase">
										Signatures Collected
									</label>
									<span className="text-xs font-mono font-medium text-slate-700">
										{record.currentSignatures}/
										{
											record.credentialType
												.requiredSignaturesCount
										}
									</span>
								</div>
								<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
									<div
										className={`h-full transition-all duration-500 ${isPending ? "bg-amber-500" : "bg-emerald-500"}`}
										style={{
											width: `${(record.currentSignatures / record.credentialType.requiredSignaturesCount) * 100}%`,
										}}
									/>
								</div>
							</div>

							{/* Hashes */}
							<div className="space-y-4">
								<div className="group">
									<div className="flex items-center justify-between mb-1.5">
										<label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
											<Hash className="size-3" />{" "}
											Transaction Hash
										</label>
										<a
											href="#"
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<ArrowUpRight className="size-3 text-blue-500" />
										</a>
									</div>
									<button
										onClick={() =>
											copyToClipboard(
												record.txHash,
												"Tx Hash",
											)
										}
										className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md p-2 transition-colors relative"
									>
										<code className="text-[10px] text-slate-600 font-mono break-all line-clamp-2">
											{record.txHash}
										</code>
										<Copy className="absolute bottom-2 right-2 size-3 text-slate-400" />
									</button>
								</div>

								<div className="group">
									<label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-1.5">
										<Fingerprint className="size-3" /> Data
										Fingerprint
									</label>
									<button
										onClick={() =>
											copyToClipboard(
												record.dataHash,
												"Data Hash",
											)
										}
										className="w-full text-left bg-slate-900 text-slate-300 rounded-md p-2 hover:ring-2 hover:ring-slate-900/10 transition-all relative"
									>
										<code className="text-[10px] font-mono break-all line-clamp-2">
											{record.dataHash}
										</code>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Metadata (Dates) */}
					<div className="grid grid-cols-2 gap-4 text-xs">
						<div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
							<p className="text-slate-400 font-medium mb-1 flex items-center gap-1">
								<Calendar className="size-3" /> Issued
							</p>
							<p className="font-semibold text-slate-700 tabular-nums">
								{new Date(
									record.createdAt,
								).toLocaleDateString()}
							</p>
						</div>
						<div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
							<p className="text-slate-400 font-medium mb-1 flex items-center gap-1">
								<Clock className="size-3" /> Expires
							</p>
							<p className="font-semibold text-slate-700 tabular-nums">
								{record.expiration > 0
									? new Date(
											Number(record.expiration),
										).toLocaleDateString()
									: "Never"}
							</p>
						</div>
					</div>
				</div>

				{/* --- RIGHT COLUMN: Immersive PDF Preview --- */}
				<div className="lg:col-span-8 xl:col-span-9 flex flex-col h-[calc(100vh-8rem)] sticky top-24 rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-200 bg-slate-900">
					{/* Viewer Toolbar */}
					<div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-400 select-none z-10">
						<div className="flex items-center gap-3">
							<FileCheck className="size-4 text-slate-500" />
							<span className="text-xs font-medium tracking-wide text-slate-300">
								DOCUMENT PREVIEW
							</span>
						</div>
						<div className="flex items-center gap-1">
							{/* Placeholder controls for visual completeness */}
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-slate-800 hover:text-white rounded-full"
							>
								<ZoomIn className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-slate-800 hover:text-white rounded-full"
							>
								<Maximize2 className="size-4" />
							</Button>
						</div>
					</div>

					{/* Viewport */}
					<div className="flex-1 bg-[#2e333d] relative overflow-y-auto overflow-x-hidden flex items-start justify-center p-8 custom-scrollbar">
						{/* Status Overlay Watermark (if revoked) */}
						{isRevoked && (
							<div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
								<div className="bg-red-500/10 border-4 border-red-500/50 rounded-full size-64 flex items-center justify-center -rotate-12 backdrop-blur-sm">
									<span className="text-4xl font-black text-red-600 uppercase tracking-widest opacity-80">
										REVOKED
									</span>
								</div>
							</div>
						)}

						<div
							ref={onRefChange}
							className="relative w-full max-w-4xl shadow-2xl transition-all duration-300"
						>
							{isPreviewLoading ? (
								<div className="flex flex-col items-center justify-center h-96 gap-4">
									<Loader2 className="size-10 animate-spin text-slate-500" />
									<p className="text-sm text-slate-500 font-medium">
										Decrypting Document...
									</p>
								</div>
							) : pdfBlob ? (
								<Document
									file={pdfBlob}
									className="flex flex-col items-center"
									loading={null}
								>
									<Page
										pageNumber={1}
										width={containerWidth || 600}
										className="bg-white shadow-lg"
										renderTextLayer={false}
										renderAnnotationLayer={false}
									/>
								</Document>
							) : (
								<div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-600 rounded-lg">
									<span className="flex items-center gap-2">
										<FileText className="size-5" /> Document
										Preview Unavailable
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
