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
		// Parallel data fetching for performance

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
		<div className="flex flex-col gap-8 px-16">
			{/* Header Section */}
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				{/* Left: Title & Subtitle */}
				<div>
					<h1 className="text-3xl font-heading tracking-tight text-slate-900">
						Welcome back, {userProfile?.firstName}
					</h1>
					<p className="mt-1 text-muted-foreground font-mono">
						You have{" "}
						<span className="font-bold">
							{signerDashboardInsights?.pendingRecords} pending
							records
						</span>{" "}
						requiring your attention today.
					</p>
				</div>

				{/* Right: Stats Cards */}
				<div className="flex items-center gap-4">
					{/* Card 1: Pending Tasks */}
					<div className="flex min-w-[200px] items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
							<ClipboardList className="size-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-500">
								Pending Tasks
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{/* Fallback to 12 if data isn't ready, matching the image */}
								{signerDashboardInsights?.pendingRecords ?? 0}
							</p>
						</div>
					</div>

					{/* Card 2: Total Signed */}
					<div className="flex min-w-[200px] items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
							<FileSignature className="size-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-500">
								Total Signed
							</p>
							<p className="text-2xl font-bold text-slate-900">
								{/* Fallback to 145 if data isn't ready, matching the image */}
								{signerDashboardInsights?.totalSignedRecords ??
									145}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div
				className="flex items-center justify-between
			"
			>
				<div className="flex gap-2 items-center">
					<span className="p-2">
						<ClockAlert className="color text-red-600" />
					</span>
					<h1 className="text-2xl font-heading tracking-tight text-slate-900">
						Your Signing Queue
					</h1>
				</div>

				<Link
					to="/signer/queue"
					className="font-mono text-sm flex gap-2 items-end hover:text-button-primary "
				>
					View Queue
					<MoveRight className="size-4" />
				</Link>
			</div>

			{/* Rest of your page content can go here */}
			<div className="h-full rounded-xl border border-dashed text-center text-muted-foreground ">
				<SignerQueueTable records={signerPendingRecords} />
			</div>
		</div>
	);
}
