import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/stores/pdf_store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Check,
	CheckCircle2,
	Copy,
	Database,
	Download,
	ExternalLink,
	FileText,
	Loader,
	Plus,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker setup (same as your issuing page)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

type RouteSearch = {
	recordId: string;
};

export const Route = createFileRoute("/admin/sucess_issue")({
	component: RouteComponent,
	validateSearch: (search) => {
		return search as RouteSearch;
	},
	// It also passes 'recordId' into the loader function below.
	loaderDeps: ({ search }) => ({
		recordId: search.recordId,
	}),
	loader: async ({ deps, context }) => {
		console.log(deps.recordId);
		return await context.records.getRecord(deps.recordId);
	},
});

function RouteComponent() {
	const record = Route.useLoaderData();
	const { recordId } = Route.useSearch();
	const navigate = useNavigate();
	const { getPreview } = usePdfStore();

	// 2. Fetch PDF Preview (Dependent on Record Data)
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

	// 3. Resize Observer for PDF (Reused from your code)
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

	return (
		<div className="min-h-screen bg-gray-50/50 flex flex-col items-center py-12 px-4 sm:px-8 gap-8 font-sans text-slate-900">
			{/* --- Top Header --- */}
			<div className="flex flex-col items-center text-center gap-4">
				<div className="rounded-full bg-green-100 p-4">
					<Check className="size-8 text-green-600" strokeWidth={3} />
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-extrabold tracking-tight">
						Credential Successfully Minted
					</h1>
					<p className="text-slate-500 max-w-lg mx-auto">
						The academic record has been permanently anchored to the
						blockchain and is now verifiable globally.
					</p>
				</div>
			</div>

			{/* --- Main Grid Layout --- */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl">
				{/* --- Left Column: Receipt & Actions (Cols 1-4) --- */}
				<div className="lg:col-span-4 space-y-6">
					{/* Transaction Receipt Card */}
					<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
						<div className="p-6 space-y-6">
							<div className="flex items-center gap-2 mb-2">
								<FileText className="size-5 text-indigo-600" />
								<h3 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
									Transaction Receipt
								</h3>
							</div>

							{/* TX Hash */}
							<div className="space-y-1.5">
								<label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
									Transaction Hash (TXID)
								</label>
								<div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100 group">
									<code className="text-xs text-slate-600 truncate flex-1 font-mono">
										{record?.txHash}
									</code>
									<button className="text-slate-400 hover:text-indigo-600 transition-colors">
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

							{/* Status Grid */}
							<div className="grid grid-cols-2 gap-y-6 gap-x-4">
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Status
									</p>
									<div className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">
										CONFIRMED
									</div>
								</div>
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Network
									</p>
									{/* <p className="text-sm font-semibold text-slate-900">
										{record?.network || "Ethereum"}
									</p> */}
								</div>
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Block Height
									</p>
									{/* <p className="text-sm font-semibold text-slate-900">
										{record?.blockHeight || "#000000"}
									</p> */}
								</div>
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
										Gas Used
									</p>
									{/* <p className="text-sm font-semibold text-slate-900">
										{record?.gasUsed || "0 Gwei"}
									</p> */}
								</div>
							</div>

							<div className="h-px bg-slate-100 w-full" />

							{/* Student Info */}
							<div className="space-y-3">
								<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
									Student Information
								</p>
								<div className="flex items-center gap-3">
									<div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
										{record?.student?.firstName?.charAt(
											0,
										) || "S"}
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-bold text-slate-900">
											{record?.student?.firstName}{" "}
											{record?.student?.middleName}{" "}
											{record?.student?.lastName}
										</span>
										<span className="text-xs text-slate-500 font-mono">
											ID: {record?.student?.student_id} •
											Transcript (TOR)
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							className="w-full h-12 text-base shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700"
							onClick={() =>
								navigate({ to: "/admin/issue_credential" })
							}
						>
							<Plus className="mr-2 size-5" /> Issue Another
							Credential
						</Button>
						<Button
							variant="outline"
							className="w-full h-12 text-base bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
							onClick={() => navigate({ to: "/" })} // Adjust route as needed
						>
							<Database className="mr-2 size-5" /> Go to Registry
						</Button>
					</div>
				</div>

				{/* --- Right Column: Preview (Cols 5-12) --- */}
				<div className="lg:col-span-8 flex flex-col h-full min-h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
					{/* Preview Header */}
					<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h3 className="font-bold text-xs tracking-widest text-slate-500 uppercase">
							Digital Certificate Preview
						</h3>
						<Button
							variant="ghost"
							size="sm"
							className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 text-xs font-semibold"
						>
							<Download className="size-4 mr-2" /> Download PDF
						</Button>
					</div>

					{/* Preview Area */}
					<div className="flex-1 bg-slate-100/50 relative p-8 flex flex-col items-center justify-center overflow-hidden">
						<div
							ref={onRefChange}
							className="w-full h-full flex items-center justify-center shadow-2xl rounded-sm max-w-[90%] relative"
						>
							{isPreviewLoading && (
								<Loader className="animate-spin text-slate-400 size-10" />
							)}

							{!isPreviewLoading && pdfBlob && (
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
						</div>
					</div>

					{/* Verification Link Footer */}
					<div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
						<p className="text-xs text-slate-500 mb-1">
							Public Verification Link:
						</p>
						<code className="text-xs text-indigo-500 font-mono bg-indigo-50 px-2 py-1 rounded">
							verify.university.edu/cert/7712-4410-9921
						</code>
					</div>
				</div>
			</div>

			{/* --- Footer --- */}
			<div className="w-full max-w-7xl flex justify-between text-[10px] text-slate-400 pt-8 border-t border-slate-200/60 mt-auto">
				<div className="flex items-center gap-1.5">
					<CheckCircle2 className="size-3 text-green-500" />
					Record immutably secured on Blockchain • SHA-256 Checksum
					Verified
				</div>
				<div>
					Admin Console v2.4.0 • University of Blockchain Technology
				</div>
			</div>
		</div>
	);
}
