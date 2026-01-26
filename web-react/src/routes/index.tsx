import { DashboardItemCard } from "@/components/custom_components/dashboard_item_card";
import { RecentTransactionTable } from "@/components/custom_components/recent_transaction_table";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth_store";
import { createFileRoute, redirect, useLocation } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, FilePlusCorner } from "lucide-react";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	beforeLoad: () => {
		const { user } = useAuthStore.getState();

		if (!user) {
			throw redirect({ to: "/login" });
		}
	},
});

function HomeComponent() {
	const { userProfile } = useAuthStore();

	console.log(userProfile);
	return (
		<div className="w-full p-8 flex flex-col gap-4">
			{/* Title */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="font-heading text-3xl">Dashboard</h1>
					<p className="font-mono text-muted-foreground">
						Manage credentials off-chain and on-chain
					</p>
				</div>

				<Button variant="default" size={"lg"} className="p-6">
					<FilePlusCorner />
					Issue New Credential
				</Button>
			</div>

			{/* Insights cards */}
			<div className="flex flex-row gap-8">
				<DashboardItemCard
					icon={
						<BadgeCheck className="size-8" fill="current-color" />
					}
					title="Total Credential Issued"
					value="12,450"
				/>
				<DashboardItemCard
					icon={<BadgeCheck className="size-8" />}
					title="Total Credential Issued"
					value="12,450"
				/>
				<DashboardItemCard
					icon={<BadgeCheck className="size-8" />}
					title="Total Credential Issued"
					value="12,450"
				/>
			</div>

			{/* Table */}
			<div className="mt-4">
				<div className="flex justify-between">
					<h3 className="font-mono font-bold text-lg mb-4">
						Recent Transactions
					</h3>

					<Button variant="ghost" size="lg" className="text-blue-400">
						View All History
						<ArrowRight />
					</Button>
				</div>

				<div className="p-2 bg-white rounded-lg mb-4">
					<RecentTransactionTable />
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
