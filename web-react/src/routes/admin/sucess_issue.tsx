import { PendingBadge } from "@/components/custom_components/pending_badge";
import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/stores/pdf_store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Check,
	CheckCircle2,
	Copy,
	Download,
	ExternalLink,
	FileCheck,
	Globe,
	LayoutDashboard,
	Loader,
	ShieldCheck,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

// Worker setup

type RouteSearch = {
	recordId: string;
};

export const Route = createFileRoute("/admin/sucess_issue")({
	component: RouteComponent,
	validateSearch: (search) => {
		return search as RouteSearch;
	},
	loaderDeps: ({ search }) => ({
		recordId: search.recordId,
	}),
	loader: async ({ deps, context }) => {
		return await context.records.getRecord(deps.recordId);
	},
});

function RouteComponent() {
	const record = Route.useLoaderData();
	const navigate = useNavigate();
	const { getPreview } = usePdfStore();
	const [copied, setCopied] = useState(false);

	// Fetch PDF Preview
	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: [
			"pdf-preview",
			record?.student?.id,
			record?.credentialType?.name,
		],
		queryFn: () =>
			getPreview(record.student.id, record.credentialType.name),
		enabled: !!record,
		staleTime: 1000 * 60 * 60,
	});

	// Resize Observer Logic
	const [containerWidth, setContainerWidth] = useState<number>();
	const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const onRefChange = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (resizeTimeoutRef.current)
					clearTimeout(resizeTimeoutRef.current);
				resizeTimeoutRef.current = setTimeout(() => {
					if (entries[0]) {
						setContainerWidth(entries[0].contentRect.width);
					}
				}, 100);
			});
			resizeObserver.observe(node);
			return () => resizeObserver.disconnect();
		}
	}, []);

	const handleCopyHash = () => {
		if (record?.txHash) {
			navigator.clipboard.writeText(record.txHash);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4 sm:px-8 font-sans text-slate-900">
			{/* --- Success Hero --- */}

			<div className="flex flex-col items-center text-center gap-6 mb-12">
				<div className="relative">
					<div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50" />
					<div className="relative rounded-full bg-green-100 p-4 ring-8 ring-white shadow-sm">
						<Check
							className="size-8 text-green-600"
							strokeWidth={4}
						/>
					</div>
				</div>
				<div className="space-y-2">
					<h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
						Credential Successfully Minted
					</h1>
					<p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
						The academic record has been permanently anchored to the
						blockchain and is now verifiable globally.
					</p>
				</div>
			</div>

			{/* --- Main Grid Layout --- */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
				{/* --- Left Column: Receipt & Actions --- */}
				<div className="lg:col-span-5 space-y-6">
					{/* Receipt Card */}
					<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
						<div className="p-1 bg-slate-100 border-b border-slate-200 flex items-center justify-between px-4 py-2">
							<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
								<FileCheck className="size-3" /> Official
								Receipt
							</span>
							<span className="text-[10px] font-mono text-slate-400">
								{new Date().toLocaleDateString()}
							</span>
						</div>

						<div className="p-6 space-y-6">
							{/* TX Hash */}
							<div className="space-y-2">
								<label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
									Transaction Hash (TXID)
								</label>
								<div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 group hover:border-slate-200 transition-colors">
									<ShieldCheck className="size-4 text-green-600 shrink-0" />
									<code className="text-xs text-slate-600 truncate flex-1 font-mono">
										{record?.txHash || "0x..."}
									</code>
									<button
										onClick={handleCopyHash}
										className="text-slate-400 hover:text-[var(--button-primary)] transition-colors p-1"
									>
										{copied ? (
											<Check className="size-3.5" />
										) : (
											<Copy className="size-3.5" />
										)}
									</button>
								</div>
								<a
									href={`https://sepolia.etherscan.io/tx/${record?.txHash}`}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1 text-xs text-[var(--button-primary)] font-medium hover:underline pl-1"
								>
									View on Block Explorer{" "}
									<ExternalLink className="size-3" />
								</a>
							</div>

							<div className="h-px bg-slate-100 w-full" />

							{/* Details Grid */}
							<div className="grid grid-cols-2 gap-y-6 gap-x-4">
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Status
									</p>
									<div className="flex">
										<PendingBadge />
									</div>
								</div>
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Network
									</p>
									<div className="flex items-center gap-1.5">
										<div className="size-1.5 rounded-full bg-green-500" />
										<p className="text-sm font-semibold text-slate-900">
											Sepolia Testnet
										</p>
									</div>
								</div>
							</div>

							{/* Student Info */}
							<div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100 space-y-3">
								<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
									Issued To
								</p>
								<div className="flex items-center gap-3">
									<div className="size-10 rounded-full bg-white flex items-center justify-center text-slate-700 font-bold border border-slate-200 shadow-sm">
										{record?.student?.firstName?.charAt(
											0,
										) || "S"}
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-bold text-slate-900">
											{record?.student?.firstName}{" "}
											{record?.student?.lastName}
										</span>
										<span className="text-xs text-slate-500 font-mono">
											ID: {record?.student?.student_id}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Button
							className="h-12 bg-[var(--button-primary)] hover:opacity-90 shadow-lg shadow-blue-500/20 text-sm font-semibold"
							onClick={() =>
								navigate({ to: "/admin/issue_credential" })
							}
						>
							<CheckCircle2 className="mr-2 size-4" /> Issue
							Another
						</Button>
						<Button
							variant="outline"
							className="h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
							onClick={() => navigate({ to: "/" })}
						>
							<LayoutDashboard className="mr-2 size-4" /> Go to
							Registry
						</Button>
					</div>
				</div>

				{/* --- Right Column: Preview --- */}
				<div className="lg:col-span-7 flex flex-col h-full min-h-[500px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
					{/* Header */}
					<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h3 className="font-bold text-xs tracking-widest text-slate-500 uppercase flex items-center gap-2">
							Preview
						</h3>
						{pdfBlob && (
							<Button
								variant="ghost"
								size="sm"
								className="text-[var(--button-primary)] hover:bg-blue-50 h-8 text-xs font-semibold"
								onClick={() => {
									const url =
										window.URL.createObjectURL(pdfBlob);
									const link = document.createElement("a");
									link.href = url;
									link.download = `credential-${record.credentialRef}.pdf`;
									link.click();
								}}
							>
								<Download className="size-3.5 mr-2" /> Download
								PDF
							</Button>
						)}
					</div>

					{/* Canvas */}
					<div className="flex-1 bg-slate-100/50 relative p-8 flex flex-col items-center justify-center overflow-hidden">
						<div
							ref={onRefChange}
							className="w-full h-full flex items-center justify-center shadow-2xl rounded-sm max-w-[95%] relative transition-all duration-500"
						>
							{isPreviewLoading && (
								<div className="flex flex-col items-center gap-3">
									<Loader className="animate-spin text-slate-400 size-8" />
									<span className="text-xs text-slate-400 font-medium">
										Rendering Final Document...
									</span>
								</div>
							)}

							{!isPreviewLoading && pdfBlob && (
								<Document
									file={pdfBlob}
									className="flex justify-center shadow-lg"
									loading={null}
								>
									<Page
										pageNumber={1}
										width={
											containerWidth
												? containerWidth
												: 500
										}
										renderTextLayer={false}
										renderAnnotationLayer={false}
										className="shadow-xl"
									/>
								</Document>
							)}
						</div>
					</div>

					{/* Verification Link Footer */}
					<div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2 text-slate-400">
							<Globe className="size-4" />
							<span className="text-xs">
								Public Verification Link
							</span>
						</div>
						<div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
							<a
								href={`http://127.0.0.1:5137/verify/
								${record.credentialRef}`}
								className="text-[10px] text-blue-300 font-mono"
							>
								https://cert-us.website/verify/
								{record.credentialRef}
							</a>
							<button className="text-slate-400 hover:text-white transition-colors">
								<Copy className="size-3" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* --- Footer --- */}
			<div className="w-full max-w-6xl flex justify-between text-[10px] text-slate-400 pt-12 mt-auto">
				<div className="flex items-center gap-1.5">
					<CheckCircle2 className="size-3 text-green-500" />
					Record secured on Blockchain • SHA-256 Checksum Verified
				</div>
				<div>Cert-us v1.0</div>
			</div>
		</div>
	);
}
