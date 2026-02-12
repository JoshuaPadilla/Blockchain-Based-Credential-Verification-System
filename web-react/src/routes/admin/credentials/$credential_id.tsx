import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { pdfBlobToDataUrl } from "@/helpers/pdf_helper";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Ban,
	Calendar,
	CheckCircle2,
	Clock,
	Copy,
	Download,
	FileStack,
	Fingerprint,
	Hash,
	Loader,
	Loader2,
	MapPin,
	Shield,
	ShieldAlert,
	ShieldCheck,
	User,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
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
	const { getFinalPdf } = usePdfStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [imagePdf, setImagePdf] = useState<string | null>(null);

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
		queryKey: ["pdd-final", record],
		queryFn: () => getFinalPdf(record?.id || ""),
		enabled: !!record,
		staleTime: 1000 * 60 * 60,
	});

	useEffect(() => {
		let active = true;
		if (pdfBlob) {
			pdfBlobToDataUrl(pdfBlob)
				.then((base64Image) => {
					if (active) setImagePdf(base64Image);
				})
				.catch((err) => console.error("PDF Conversion Failed", err));
		}
		return () => {
			active = false;
		};
	}, [pdfBlob]);

	// --- Helpers ---
	const copyToClipboard = (text: string, label: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard`);
	};

	const formatDate = (dateString: string | number) => {
		if (!dateString) return "-";
		return new Date(Number(dateString)).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString: string) => {
		if (!dateString) return "-";
		return new Date(dateString).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const downloadPdf = () => {
		if (pdfBlob && record) {
			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${record.credentialType.name}-${record.student.lastName}.pdf`;
			link.click();
		}
	};

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
						<div className="flex items-center gap-2">
							<h1 className="text-sm font-bold text-slate-900 leading-none">
								{record.credentialType.name}
							</h1>
							<span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
								{record.credentialRef}
							</span>
						</div>
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
						className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
					>
						<Download className="mr-2 size-3.5" />
						Download PDF
					</Button>
				</div>
			</header>

			{/* --- Main Workspace Grid --- */}
			<main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* --- LEFT COLUMN: Detailed Metadata --- */}
				<div className="lg:col-span-5 xl:col-span-4 space-y-6">
					{/* 1. Student Identity Card */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
						<div className="p-6 flex items-start gap-4">
							<Avatar className="size-16 border-2 border-white shadow-sm">
								<AvatarImage
									src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.student.firstName}`}
								/>
								<AvatarFallback className="bg-slate-100 text-slate-600 text-xl font-bold">
									{record.student.firstName[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<h2 className="text-lg font-bold text-slate-900 truncate">
									{record.student.firstName}{" "}
									{record.student.middleName}{" "}
									{record.student.lastName}
								</h2>
								<div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
									<span className="font-mono bg-slate-50 px-1.5 rounded border border-slate-100 text-xs">
										{record.student.student_id}
									</span>
									<span>•</span>
									<span>Year {record.student.yearLevel}</span>
								</div>
								<p className="text-xs font-medium text-blue-600 truncate">
									{record.student.course}
								</p>
							</div>
						</div>

						{/* Status Bar */}
						<div
							className={`px-6 py-3 border-t flex items-center justify-between ${
								isRevoked
									? "bg-red-50 border-red-100"
									: isPending
										? "bg-amber-50 border-amber-100"
										: "bg-emerald-50 border-emerald-100"
							}`}
						>
							<div className="flex items-center gap-2">
								{isRevoked ? (
									<ShieldAlert className="size-4 text-red-600" />
								) : isPending ? (
									<Loader2 className="size-4 text-amber-600 animate-spin" />
								) : (
									<ShieldCheck className="size-4 text-emerald-600" />
								)}
								<span
									className={`text-xs font-bold uppercase ${
										isRevoked
											? "text-red-700"
											: isPending
												? "text-amber-700"
												: "text-emerald-700"
									}`}
								>
									{isRevoked
										? "Revoked Credential"
										: isPending
											? "Pending Signatures"
											: "Verified & Active"}
								</span>
							</div>
							{record.expiration > 0 && (
								<div className="flex items-center gap-1.5 text-xs text-slate-500">
									<Clock className="size-3.5" />
									Exp: {formatDate(Number(record.expiration))}
								</div>
							)}
						</div>
					</div>

					{/* 2. Personal Information */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
							<User className="size-3.5" /> Personal Details
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<InfoRow
								icon={<MapPin className="size-3.5" />}
								label="Address"
								value={record.student.address}
							/>
							<InfoRow
								icon={<Users className="size-3.5" />}
								label="Guardian"
								value={record.student.guardianName}
							/>
						</div>
					</div>

					{/* 3. Blockchain Ledger (Signatures & Hashes) */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
						<div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
							<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
								<Shield className="size-3.5" /> Blockchain
								Ledger
							</h3>
							<div className="text-[10px] font-mono bg-slate-200/50 px-2 py-0.5 rounded text-slate-600">
								{record.currentSignatures}/
								{record.credentialType.requiredSignaturesCount}{" "}
								Signatures
							</div>
						</div>

						<div className="p-5 space-y-6">
							{/* Signature Timeline */}
							<div className="space-y-4">
								{record.signatures &&
									record.signatures.map(
										(sig, index: number) => (
											<div
												key={sig.id}
												className="flex gap-3 relative group"
											>
												{/* Connector Line */}
												{index !==
													record.signatures.length -
														1 && (
													<div className="absolute left-[9px] top-6 bottom-[-20px] w-px bg-emerald-100" />
												)}

												<div className="mt-1">
													<CheckCircle2 className="size-5 text-emerald-500 bg-white relative z-10" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex justify-between items-start">
														<p className="text-xs font-bold text-slate-700">
															Signed & Confirmed
														</p>
														<span className="text-[10px] text-slate-400 font-mono">
															{formatDateTime(
																sig.signedAt.toString(),
															)}
														</span>
													</div>
													<div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-100 text-[10px] space-y-1">
														<div className="flex justify-between">
															<span className="text-slate-500">
																Signer
															</span>
															<span className="font-mono text-slate-700">
																{sig.signer.signerPosition?.toUpperCase()}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-slate-500">
																Block
															</span>
															<span className="font-mono text-slate-700">
																#
																{
																	sig.blockNumber
																}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-slate-500">
																Gas
															</span>
															<span className="font-mono text-slate-700">
																{sig.gasUsed}{" "}
																Wei
															</span>
														</div>
														<div
															className="flex justify-between items-center cursor-pointer hover:text-blue-600 transition-colors"
															onClick={() =>
																copyToClipboard(
																	sig.txHash,
																	"Tx Hash",
																)
															}
														>
															<span className="text-slate-500">
																Tx
															</span>
															<span className="font-mono truncate max-w-[120px]">
																{sig.txHash}
															</span>
														</div>
													</div>
												</div>
											</div>
										),
									)}
								{/* Pending State */}
								{isPending && (
									<div className="flex gap-3 opacity-60">
										<div className="mt-1">
											<div className="size-5 rounded-full border-2 border-dashed border-slate-300 bg-white" />
										</div>
										<div className="flex-1">
											<p className="text-xs italic text-slate-500">
												Waiting for remaining
												signatures...
											</p>
										</div>
									</div>
								)}
							</div>

							<div className="border-t border-slate-100 pt-4 space-y-3">
								<HashCopy
									label="Credential Transaction Hash"
									value={record.txHash}
								/>
								<HashCopy
									label="Data Integrity Hash"
									value={record.dataHash}
									icon={
										<Fingerprint className="size-3 mr-1" />
									}
								/>

								<div className="flex justify-between items-center text-xs text-slate-400 pt-2">
									<span className="flex items-center gap-1">
										<Calendar className="size-3" /> Issued{" "}
										{formatDate(
											record.createdAt.toString(),
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* --- RIGHT COLUMN: Immersive PDF Preview --- */}
				<div className="lg:col-span-7 xl:col-span-8 flex flex-col h-[calc(100vh-8rem)] sticky top-24 rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-200 bg-slate-900">
					<div className="flex-1 bg-[#2e333d] relative overflow-y-auto overflow-x-hidden flex items-start justify-center p-8 custom-scrollbar">
						{/* Watermark for Revoked */}
						{isRevoked && (
							<div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
								<div className="bg-red-500/10 border-4 border-red-500/50 rounded-full size-64 flex items-center justify-center -rotate-12 backdrop-blur-sm">
									<span className="text-4xl font-black text-red-600 uppercase tracking-widest opacity-80">
										REVOKED
									</span>
								</div>
							</div>
						)}

						<div className="relative w-full max-w-4xl shadow-2xl transition-all duration-300">
							{isPreviewLoading && (
								<div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg p-8 h-96">
									<Loader className="size-8 animate-spin text-white mb-2" />
									<p className="text-xs font-medium text-slate-300">
										Decrypting Record...
									</p>
								</div>
							)}

							{!isPreviewLoading && pdfBlob && imagePdf && (
								<div className="shadow-xl rounded-sm overflow-hidden border border-slate-200/60 bg-white">
									<img
										src={imagePdf}
										alt="Certificate Preview"
										className="w-full h-auto object-contain"
									/>
								</div>
							)}

							{/* No Preview State */}
							{!isPreviewLoading && !pdfBlob && (
								<div className="flex flex-col items-center justify-center gap-4 text-slate-300 py-12">
									<FileStack className="size-16 opacity-20" />
									<p className="text-sm opacity-50">
										Preview unavailable for this record
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

// --- Sub-Components for Cleanliness ---

const InfoRow = ({
	icon,
	label,
	value,
	copyable = false,
}: {
	icon: any;
	label: string;
	value: string;
	copyable?: boolean;
}) => {
	const copy = () => {
		if (copyable && value) {
			navigator.clipboard.writeText(value);
			toast.success("Copied to clipboard");
		}
	};

	return (
		<div
			className={`flex justify-between items-start text-sm group ${copyable ? "cursor-pointer" : ""}`}
			onClick={copy}
		>
			<div className="flex items-center gap-2 text-slate-500 mt-0.5">
				{icon}
				<span>{label}</span>
			</div>
			<div className="flex items-center gap-2 max-w-[60%] text-right">
				<span
					className={`font-medium text-slate-900 break-words ${copyable ? "group-hover:text-blue-600 transition-colors" : ""}`}
				>
					{value || "-"}
				</span>
				{copyable && (
					<Copy className="size-3 opacity-0 group-hover:opacity-100 text-slate-400" />
				)}
			</div>
		</div>
	);
};

const HashCopy = ({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon?: any;
}) => {
	const copy = () => {
		navigator.clipboard.writeText(value);
		toast.success("Hash copied");
	};

	return (
		<div className="group">
			<label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-1.5">
				{icon || <Hash className="size-3" />} {label}
			</label>
			<button
				onClick={copy}
				className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded p-2 transition-colors relative"
			>
				<code className="text-[10px] text-slate-600 font-mono break-all line-clamp-2">
					{value}
				</code>
				<Copy className="absolute bottom-2 right-2 size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
			</button>
		</div>
	);
};
