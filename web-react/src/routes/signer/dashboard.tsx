import { SignerQueueTable } from "@/components/custom_components/signer_queue_table";
import { useAuthStore } from "@/stores/auth_store";
import { useInsightsStore } from "@/stores/insights_store";
import { useRecordStore } from "@/stores/record_store";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ClipboardList,
	ClockAlert,
	FileSignature,
	MoveRight,
} from "lucide-react";

export const Route = createFileRoute("/signer/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await Promise.all([
			context.insights.getSingerDashboardInsights(),
			context.records.getSignerRecordsToSign(),
		]);
	},
});

function RouteComponent() {
	const { signerDashboardInsights } = useInsightsStore();
	const { userProfile } = useAuthStore();
	const { signerPendingRecords } = useRecordStore();

	return (
		// CHANGE 1: Responsive padding (px-4 for mobile, px-16 for desktop)
		<div className="flex flex-col gap-8 px-4 md:px-8 lg:px-16 py-6 pb-20">
			{/* Header Section */}
			{/* CHANGE 2: Stack vertically on mobile, row on medium screens */}
			<div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
				{/* Left: Title & Subtitle */}
				<div>
					<h1 className="text-2xl md:text-3xl font-heading tracking-tight text-slate-900">
						Welcome back, {userProfile?.firstName}
					</h1>
					<p className="mt-1 text-sm md:text-base text-muted-foreground font-mono">
						You have{" "}
						<span className="font-bold">
							{signerDashboardInsights?.pendingRecords} pending
							records
						</span>{" "}
						requiring your attention today.
					</p>
				</div>

				{/* Right: Stats Cards */}
				{/* CHANGE 3: Grid layout for stats ensures they don't squish */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
					{/* Card 1: Pending Tasks */}
					<div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
							<ClipboardList className="size-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-500">
								Pending Tasks
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{signerDashboardInsights?.pendingRecords ?? 0}
							</p>
						</div>
					</div>

					{/* Card 2: Total Signed */}
					<div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-green-50 text-green-600 shrink-0">
							<FileSignature className="size-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-500">
								Total Signed
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{signerDashboardInsights?.totalSignedRecords ??
									145}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Table Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex gap-2 items-center">
					<span className="p-2 bg-red-50 rounded-full">
						<ClockAlert className="text-red-600 size-5" />
					</span>
					<h1 className="text-xl md:text-2xl font-heading tracking-tight text-slate-900">
						Your Signing Queue
					</h1>
				</div>

				<Link
					to="/signer/queue"
					className="font-mono text-sm flex gap-2 items-center text-slate-600 hover:text-blue-600 transition-colors"
				>
					View Queue
					<MoveRight className="size-4" />
				</Link>
			</div>

			{/* Table Content */}
			<div className="h-full rounded-xl border border-dashed text-center text-muted-foreground">
				<SignerQueueTable records={signerPendingRecords} />
			</div>
		</div>
	);
}
