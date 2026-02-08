import { DashboardStats } from "@/components/custom_components/dashboard_stats";
import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { RecentTransactionTable } from "@/components/custom_components/recent_transaction_table";
import { Button } from "@/components/ui/button";
import { useInsightsStore } from "@/stores/insights_store";
import { useRecordStore } from "@/stores/record_store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		// Parallel data fetching for performance

		await Promise.all([
			context.insights.getAdminDashboardInsights(),
			context.records.getRecords(),
		]);
	},
	pendingComponent: () => <PendingSkeleton />,
});

function RouteComponent() {
	const { adminDashboardInsights } = useInsightsStore();
	const { adminRecords } = useRecordStore();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-slate-50/50 p-8 font-sans space-y-8 text-slate-900">
			{/* --- Header Section --- */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
				<div className="flex items-center gap-3">
					<div className="size-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
						<LayoutDashboard className="size-5 text-[var(--button-primary)]" />
					</div>
					<div>
						<h1 className="font-heading text-2xl font-bold tracking-tight">
							Overview
						</h1>
						<p className="text-sm text-slate-500 font-medium">
							Real-time registry statistics and issuance
							management.
						</p>
					</div>
				</div>

				<Button
					size="lg"
					className="bg-[var(--button-primary)] hover:opacity-90 shadow-lg shadow-blue-500/20 text-white font-medium"
					onClick={() => navigate({ to: "/admin/issue_credential" })}
				>
					<FilePlus2 className="mr-2 size-4" /> Issue Credential
				</Button>
			</div>

			{/* --- Stats Row --- */}
			<DashboardStats insights={adminDashboardInsights} />

			{/* --- Table Section --- */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h3 className="font-heading font-bold text-lg text-slate-800">
						Recent Issuance History
					</h3>
					<Button
						variant="ghost"
						className="text-[var(--button-primary)] hover:bg-blue-50 hover:text-blue-700 text-sm font-semibold"
						onClick={() => navigate({ to: "/admin/credentials" })}
					>
						View Full Registry{" "}
						<ArrowRight className="ml-2 size-4" />
					</Button>
				</div>

				<RecentTransactionTable records={adminRecords} />
			</div>
		</div>
	);
}
