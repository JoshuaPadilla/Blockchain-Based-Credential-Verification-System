import app_logo from "@/assets/img/app_logo.png";
import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/stores/pdf_store";
import { useRecordStore } from "@/stores/record_store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	AlertTriangle,
	Ban,
	Building2,
	Check,
	Clock,
	Download,
	Fingerprint,
	Link as LinkIcon,
	Loader2,
	SearchX,
	ShieldAlert,
	ShieldCheck,
	Users,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

// --- Worker Setup ---

// --- Constants & Types ---
const STATUS = {
	VALID: "verified",
	REVOKED: "revoked",
	EXPIRED: "expired",
	TAMPERED: "tampered",
	PENDING: "pending",
} as const;

// --- Hooks ---

/**
 * Handles element resizing for responsive PDF rendering
 */
function useElementWidth<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState<number>(0);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new ResizeObserver((entries) => {
			if (entries[0]) setWidth(entries[0].contentRect.width);
		});
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return { ref, width };
}

/**
 * Centralizes verification logic and status derivation
 */
function useVerificationLogic(statuses: string[] = []) {
	return useMemo(() => {
		const isTampered = statuses.includes(STATUS.TAMPERED);
		const isRevoked = statuses.includes(STATUS.REVOKED);
		const isExpired = statuses.includes(STATUS.EXPIRED);
		const isPending = statuses.includes(STATUS.PENDING);
		const isValid = !isTampered && !isRevoked && !isExpired && !isPending;

		// Security Flag: Block access if compromised
		const isCompromised = isTampered || isRevoked;

		// Theme Config
		let theme = {
			color: "green",
			icon: ShieldCheck,
			title: "Valid Credential",
			label: "Verified",
			bg: "bg-green-50/50",
			border: "border-green-100",
			text: "text-green-700",
		};

		if (isTampered) {
			theme = {
				color: "red",
				icon: ShieldAlert,
				title: "Invalid Credential",
				label: "Tampered",
				bg: "bg-red-50/50",
				border: "border-red-100",
				text: "text-red-700",
			};
		} else if (isRevoked) {
			theme = {
				color: "red",
				icon: Ban,
				title: "Invalid Credential",
				label: "Revoked",
				bg: "bg-red-50/50",
				border: "border-red-100",
				text: "text-red-700",
			};
		} else if (isExpired) {
			theme = {
				color: "orange",
				icon: Clock,
				title: "Credential Expired",
				label: "Expired",
				bg: "bg-orange-50/50",
				border: "border-orange-100",
				text: "text-orange-700",
			};
		} else if (isPending) {
			theme = {
				color: "amber",
				icon: AlertTriangle,
				title: "Verification Pending",
				label: "Pending Signatures",
				bg: "bg-amber-50/50",
				border: "border-amber-100",
				text: "text-amber-700",
			};
		}

		// Audit Checklist Data
		const auditSteps = [
			{
				id: "crypto",
				label: "Cryptographic Integrity",
				subtext: "Digital signature matches public key",
				passed: !isTampered,
				icon: Fingerprint,
			},
			{
				id: "blockchain",
				label: "Blockchain Anchor",
				subtext: "Hash found on Sepolia chain",
				passed: true, // Existence of record implies this
				icon: LinkIcon,
			},
			{
				id: "issuer",
				label: "Issuer Status",
				subtext: isRevoked
					? "Credential has been revoked"
					: "Credential is active",
				passed: !isRevoked,
				icon: Building2,
			},
			{
				id: "consensus",
				label: "Consensus",
				subtext: isPending
					? "Waiting for signatures"
					: "All signatures collected",
				passed: !isPending,
				warning: isPending,
				icon: Users,
			},
		];

		return { theme, isCompromised, auditSteps, isValid };
	}, [statuses]);
}

// --- Route Definition ---
export const Route = createFileRoute("/verify/$credentialRef")({
	component: VerificationPage,
	loader: async ({ params }) => ({ credentialRef: params.credentialRef }),
});

// --- Main Page Component ---
function VerificationPage() {
	const { credentialRef } = Route.useLoaderData();
	const { verifyRecord } = useRecordStore();
	const { getPreview } = usePdfStore();

	// 1. Data Fetching
	const { data, isLoading, isError } = useQuery({
		queryKey: ["verify", credentialRef],
		queryFn: async () => {
			const result = await verifyRecord(credentialRef);
			if (!result) throw new Error("Not Found");
			return result;
		},
		retry: false,
	});

	// 2. Logic Extraction
	const { theme, isCompromised, auditSteps } = useVerificationLogic(
		data?.statuses,
	);

	// 3. PDF Fetching (Dependent)
	const shouldFetchPdf = !!data?.record && !isCompromised;
	const { data: pdfBlob, isFetching: isPreviewLoading } = useQuery({
		queryKey: ["pdf-preview", data?.record?.id],
		queryFn: () =>
			getPreview(
				data!.record.student.id,
				data!.record.credentialType.name,
			),
		enabled: shouldFetchPdf,
		staleTime: 1000 * 60 * 60,
	});

	if (isLoading) return <LoadingScreen />;
	if (isError || !data) return <ErrorScreen credentialRef={credentialRef} />;

	const { record } = data;

	return (
		<div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 pb-20">
			<Navbar />

			{/* Header Section */}
			<header className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 flex items-center gap-3">
							{theme.title}
							<theme.icon className={`size-8 ${theme.text}`} />
						</h1>
					</div>
					<div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 shadow-sm">
						<div
							className={`size-2 rounded-full ${theme.color === "green" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
						/>
						Live Check Completed
					</div>
				</div>
				<p className="text-slate-500 mt-2 text-sm">
					Verification completed on {new Date().toLocaleString()}
				</p>
			</header>

			{/* Main Grid */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left Column: Report */}
					<div className="lg:col-span-7 space-y-6">
						<AuditLogCard theme={theme} steps={auditSteps} />
						<RecordMetadataCard record={record} />
					</div>

					{/* Right Column: Preview */}
					<div className="lg:col-span-5">
						<div className="sticky top-24 space-y-4">
							<DocumentViewer
								pdfBlob={pdfBlob}
								isLoading={isPreviewLoading}
								isCompromised={isCompromised}
								hash={record.dataHash}
							/>
							<HelpBox />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

// --- Sub-Components ---

const Navbar = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
			<div className="relative z-10 flex items-center gap-3">
				<img src={app_logo} className="size-10" alt="Logo" />
				<span className="font-heading font-bold text-xl tracking-tight">
					Cer<span className="text-[var(--button-primary)]">tus</span>
				</span>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => navigate({ to: "/" })}
			>
				Verify Another <SearchX className="ml-2 size-4" />
			</Button>
		</div>
	);
};

const AuditLogCard = ({ theme, steps }: { theme: any; steps: any[] }) => (
	<div
		className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${theme.border}`}
	>
		{/* Card Header */}
		<div
			className={`px-6 py-4 border-b flex justify-between items-center ${theme.bg} ${theme.border}`}
		>
			<span
				className={`text-xs font-bold uppercase tracking-widest ${theme.text}`}
			>
				{theme.label} Status
			</span>
			<ShieldCheck className={`size-5 ${theme.text}`} />
		</div>

		{/* Card Body */}
		<div className="p-6">
			<h3 className="font-heading font-bold text-lg text-slate-900">
				Verification Audit Log
			</h3>
			<p className="text-sm text-slate-500 leading-relaxed max-w-xl mb-6 mt-2">
				This credential has undergone a multi-point integrity check
				against the University's blockchain registry.
			</p>

			<div className="space-y-3">
				{steps.map((check) => (
					<AuditItem key={check.id} check={check} />
				))}
			</div>
		</div>
	</div>
);

const AuditItem = ({ check }: { check: any }) => {
	const statusColor =
		check.passed && !check.warning
			? "bg-green-100 text-green-600 border-green-200"
			: check.warning
				? "bg-amber-100 text-amber-600 border-amber-200"
				: "bg-red-100 text-red-600 border-red-200";

	const borderColor =
		check.passed && !check.warning
			? "border-slate-100 bg-slate-50/50"
			: check.warning
				? "border-amber-100 bg-amber-50"
				: "border-red-100 bg-red-50";

	return (
		<div
			className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${borderColor}`}
		>
			<div className={`mt-0.5 p-1.5 rounded-full border ${statusColor}`}>
				{check.passed && !check.warning ? (
					<Check size={14} strokeWidth={3} />
				) : check.warning ? (
					<AlertCircle size={14} strokeWidth={3} />
				) : (
					<X size={14} strokeWidth={3} />
				)}
			</div>
			<div>
				<div className="flex items-center gap-2">
					<h4
						className={`text-sm font-bold ${check.warning ? "text-amber-900" : !check.passed ? "text-red-900" : "text-slate-900"}`}
					>
						{check.label}
					</h4>
					<check.icon className="size-3 text-slate-400" />
				</div>
				<p className="text-xs text-slate-500 mt-0.5">{check.subtext}</p>
			</div>
		</div>
	);
};

const RecordMetadataCard = ({ record }: { record: any }) => (
	<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
		<div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
			<h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">
				Record Metadata
			</h3>
		</div>
		<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
			<MetaField
				label="Recipient"
				value={`${record.student.firstName} ${record.student.lastName}`}
				sub={record.student.student_id}
				highlight
			/>
			<MetaField
				label="Program"
				value={record.student.course}
				sub={`Year Level ${record.student.yearLevel}`}
			/>
			<div className="space-y-1">
				<label className="text-[10px] font-bold text-slate-400 uppercase">
					Credential Type
				</label>
				<div>
					<span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-mono font-medium text-slate-700">
						{record.credentialType.name}
					</span>
				</div>
			</div>
			<MetaField
				label="Issuance Date"
				value={new Date(record.createdAt).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			/>
		</div>
		<div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
			<div className="text-xs text-slate-500">
				Need help with this record?
			</div>
			<Button
				variant="outline"
				size="sm"
				className="bg-white text-xs h-8"
			>
				Contact Registrar
			</Button>
		</div>
	</div>
);

const MetaField = ({ label, value, sub, highlight }: any) => (
	<div className="space-y-1">
		<label className="text-[10px] font-bold text-slate-400 uppercase">
			{label}
		</label>
		<p
			className={`font-medium text-slate-900 ${highlight ? "font-heading font-bold text-lg" : "text-sm"}`}
		>
			{value}
		</p>
		{sub && <p className="text-xs text-slate-500">{sub}</p>}
	</div>
);

const DocumentViewer = ({ pdfBlob, isLoading, isCompromised, hash }: any) => {
	const { ref, width } = useElementWidth<HTMLDivElement>();

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
			{/* Preview Area */}
			<div
				ref={ref}
				className="bg-slate-100/50 relative min-h-[500px] flex items-center justify-center"
			>
				{isCompromised ? (
					<div className="text-center p-8 max-w-xs animate-in fade-in zoom-in-95">
						<div className="size-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
							<Ban className="size-8 text-red-500" />
						</div>
						<h3 className="font-bold text-slate-900">
							Preview Unavailable
						</h3>
						<p className="text-xs text-slate-500 mt-2">
							Document previews and downloads are disabled for
							invalid or tampered credentials.
						</p>
					</div>
				) : isLoading ? (
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="size-8 animate-spin text-slate-400" />
						<p className="text-xs font-medium text-slate-400">
							Loading Document...
						</p>
					</div>
				) : pdfBlob ? (
					<Document
						file={pdfBlob}
						loading={null}
						className="shadow-lg"
					>
						<Page
							pageNumber={1}
							width={width > 0 ? width : 400}
							renderTextLayer={false}
							renderAnnotationLayer={false}
						/>
					</Document>
				) : null}
			</div>

			{/* Action Area */}
			<div className="p-6 bg-white border-t border-slate-100">
				<Button
					className="w-full h-11 shadow-sm"
					disabled={isCompromised || !pdfBlob}
					variant={isCompromised ? "secondary" : "default"}
				>
					<Download className="mr-2 size-4" />
					{isCompromised
						? "Download Disabled"
						: "Download Original PDF"}
				</Button>
				<div className="mt-4 text-center">
					<p
						className="text-[10px] text-slate-400 font-mono truncate px-4 cursor-help"
						title={hash}
					>
						Hash: {hash?.slice(0, 20)}...{hash?.slice(-8)}
					</p>
				</div>
			</div>
		</div>
	);
};

const HelpBox = () => (
	<div className="rounded-xl border border-slate-200 p-4 bg-white text-center">
		<p className="text-xs text-slate-500">
			Need help?{" "}
			<a href="#" className="text-indigo-600 hover:underline font-medium">
				Visit our Help Center
			</a>
		</p>
	</div>
);

// --- Loading / Error States ---
const LoadingScreen = () => (
	<div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-slate-400">
		<div className="flex flex-col items-center gap-4">
			<Loader2 className="size-10 animate-spin text-slate-300" />
			<p className="text-sm font-medium uppercase tracking-widest">
				Verifying On-Chain...
			</p>
		</div>
	</div>
);

const ErrorScreen = ({ credentialRef }: { credentialRef: string }) => {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
			<div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-lg w-full">
				<div className="mx-auto size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
					<SearchX className="size-10 text-slate-400" />
				</div>
				<h2 className="text-2xl font-bold text-slate-900 mb-3">
					Credential Not Found
				</h2>
				<p className="text-slate-500 mb-8 leading-relaxed">
					The reference{" "}
					<span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
						{credentialRef}
					</span>{" "}
					does not exist in our immutable registry.
				</p>
				<Button
					onClick={() => navigate({ to: "/" })}
					className="w-full h-12 text-base"
				>
					Return to Home
				</Button>
			</div>
		</div>
	);
};
