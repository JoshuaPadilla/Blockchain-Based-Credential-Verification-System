import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileCheck2, FileX2 } from "lucide-react";

type Props = {
	insights: any; // Replace with your actual Insights type
};

export const DashboardStats = ({ insights }: Props) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<StatCard
				title="Total Issued"
				value={insights?.totalRecords || 0}
				icon={FileCheck2}
				color="text-blue-600"
				bg="bg-blue-50"
				border="border-blue-100"
			/>
			<StatCard
				title="Pending Signatures"
				value={insights?.pendingRecords || 0}
				icon={Clock}
				color="text-amber-600"
				bg="bg-amber-50"
				border="border-amber-100"
			/>
			<StatCard
				title="Revoked Credentials"
				value={insights?.revokedRecords || 0}
				icon={FileX2}
				color="text-red-600"
				bg="bg-red-50"
				border="border-red-100"
			/>
		</div>
	);
};

// Internal Helper
function StatCard({ title, value, icon: Icon, color, bg, border }: any) {
	return (
		<Card className={`shadow-sm border ${border}`}>
			<CardContent className="p-6 flex items-center justify-between">
				<div className="space-y-1">
					<p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
						{title}
					</p>
					<div className="text-3xl font-heading font-bold text-slate-900">
						{value}
					</div>
				</div>
				<div
					className={`size-12 rounded-xl flex items-center justify-center ${bg} ${color}`}
				>
					<Icon className="size-6" strokeWidth={2.5} />
				</div>
			</CardContent>
		</Card>
	);
}
