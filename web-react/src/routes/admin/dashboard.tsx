import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardItemCard } from "@/components/custom_components/dashboard_item_card";
import { RecentTransactionTable } from "@/components/custom_components/recent_transaction_table";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth_store";
import { useInsightsStore } from "@/stores/insights_store";
import { useRecordStore } from "@/stores/record_store";
import {
	ArrowRight,
	BadgeCheck,
	ClipboardClock,
	ClipboardX,
	FilePlusCorner,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.insights.getDashboardInsights();
		await context.records.getRecords();
	},
});

function RouteComponent() {
	const { dashboardInsights } = useInsightsStore();
	const { records } = useRecordStore();
	const { setOpen } = useSidebar();

	const navigate = useNavigate();

	const handleViewAllHistory = () => {
		navigate({ to: "/admin/credentials" });
	};

	const handleIssueCredential = () => {
		setOpen(false);
		navigate({ to: "/admin/issue_credential" });
	};

	return (
		<div className="w-full flex flex-col gap-4 h-screen p-8">
			{/* Title */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="font-heading text-3xl">Dashboard</h1>
					<p className="font-mono text-muted-foreground">
						Manage credentials off-chain and on-chain
					</p>
				</div>

				<Button
					variant="default"
					size={"lg"}
					className="p-6"
					onClick={handleIssueCredential}
				>
					<FilePlusCorner />
					Issue New Credential
				</Button>
			</div>

			{/* Insights cards */}
			<div className="flex flex-row gap-8">
				<DashboardItemCard
					icon={
						<BadgeCheck className="size-8 gray" color="#51a2ff" />
					}
					title="Total Credential Issued"
					value={String(dashboardInsights?.totalRecords) || "0"}
				/>
				<DashboardItemCard
					icon={<ClipboardClock className="size-8" color="#ff8904" />}
					title="Pending Signatures"
					value={String(dashboardInsights?.pendingRecords) || "0"}
				/>
				<DashboardItemCard
					icon={<ClipboardX className="size-8" color="#99a1af" />}
					title="Revoke Credentials"
					value={String(dashboardInsights?.revokedRecords) || "0"}
				/>
			</div>

			{/* Table */}
			<div className="mt-4">
				<div className="flex justify-between">
					<h3 className="font-mono font-bold text-lg mb-4">
						Recent Transactions
					</h3>

					<Button
						variant="ghost"
						size="lg"
						className="text-blue-400"
						onClick={handleViewAllHistory}
					>
						View All History
						<ArrowRight />
					</Button>
				</div>

				<div className="p-2 bg-white rounded-lg mb-4">
					<RecentTransactionTable records={records} />
				</div>

				<div className="flex flex-col items-center justify-center gap-2">
					<p className="font-mono text-primary/60">
						Showing 5 of 12,450 records
					</p>

					<Button variant={"outline"}>Next</Button>
				</div>
			</div>
		</div>
	);
}
