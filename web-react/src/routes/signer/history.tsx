import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { RecordSignature } from "@/types/record_signature";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Calendar as CalendarIcon,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	FileSignature,
	Search,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signer/history")({
	component: SignerHistoryPage,
});

// --- Mock Data Generator (Simulating your DB) ---
// In a real app, you would fetch this using your stores/hooks
const MOCK_HISTORY_DATA: RecordSignature[] = Array.from({ length: 8 }).map(
	(_, i) => ({
		id: `882${i + 1}`,
		txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
		signedAt: new Date(Date.now() - i * 86400000), // Decrementing days
		signer: { id: "u1", email: "signer@univ.edu", role: "SIGNER" }, // Partial User
		record: {
			id: `rec_${i}`,
			student: {
				firstName: [
					"Alice",
					"Mark",
					"Sarah",
					"Emily",
					"James",
					"Robert",
					"Linda",
					"Michael",
				][i],
				lastName: [
					"Johnson",
					"Chen",
					"Smith",
					"Rose",
					"T.",
					"Wilson",
					"Davis",
					"Brown",
				][i],
				student_id: `2023-${1000 + i}`,
			},
		} as any, // Partial Record type for UI demo
	}),
);

function SignerHistoryPage() {
	const [searchQuery, setSearchQuery] = useState("");
	// In a real app, use the actual data from your store
	const historyData = MOCK_HISTORY_DATA;

	return (
		<div className="min-h-screen bg-background font-sans text-foreground p-4 sm:p-8 space-y-8 pb-32">
			{/* --- Header & Stats Section --- */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
				<div className="space-y-2 max-w-2xl">
					<h1 className="text-3xl font-heading font-bold tracking-tight">
						Signature Audit Trail
					</h1>
					<p className="text-muted-foreground text-base">
						Review and verify all academic credentials you have
						cryptographically signed on-chain.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
					<StatCard
						label="Total Signed"
						value="1,245"
						icon={FileSignature}
					/>
					<StatCard label="Last Signed" value="Oct 24" icon={Clock} />
					<StatCard
						label="Success Rate"
						value="99.9%"
						icon={CheckCircle2}
						iconColor="text-green-500"
					/>
				</div>
			</div>

			<Separator />

			{/* --- Filter Bar --- */}
			<div className="bg-card p-2 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-3">
				{/* Search */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search by Student Name or Record ID"
						className="pl-9 bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 h-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Actions Group */}
				<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
					<Button
						variant="outline"
						className="h-10 gap-2 text-muted-foreground border-border bg-background"
					>
						<CalendarIcon className="size-4" />
						Date Range
					</Button>

					<div className="w-[140px]">
						<Select defaultValue="all">
							<SelectTrigger className="h-10 border-border bg-background text-muted-foreground">
								<SelectValue placeholder="Network" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Networks
								</SelectItem>
								<SelectItem value="eth">Ethereum</SelectItem>
								<SelectItem value="poly">Polygon</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button className="h-10 gap-2 bg-primary/10 text-primary hover:bg-primary/20 shadow-none border border-primary/20">
						<Download className="size-4" />
						Export
					</Button>
				</div>
			</div>

			{/* --- Data Table --- */}
			<div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
				{/* Table Header */}
				<div className="grid grid-cols-12 gap-4 bg-muted/30 p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border items-center">
					<div className="col-span-2 sm:col-span-1">Record ID</div>
					<div className="col-span-4 sm:col-span-3 pl-2">
						Student Name
					</div>
					<div className="col-span-3 hidden md:block">
						Date Signed
					</div>
					<div className="col-span-2 hidden lg:block">Network</div>
					<div className="col-span-3 hidden xl:block">Tx Hash</div>
					<div className="col-span-6 sm:col-span-8 md:col-span-3 lg:col-span-3 xl:col-span-2 text-right pr-4">
						Actions
					</div>
				</div>

				{/* Rows */}
				<div className="divide-y divide-border">
					{historyData.map((item, index) => {
						// Determine mock network logic for visual variety based on index
						const network =
							index % 3 === 0
								? "Polygon"
								: index % 3 === 1
									? "Ethereum"
									: "Testnet";
						const badgeVariant =
							network === "Polygon"
								? "purple"
								: network === "Ethereum"
									? "green"
									: "blue";

						return (
							<div
								key={item.id}
								className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors group"
							>
								{/* ID */}
								<div className="col-span-2 sm:col-span-1 font-mono text-sm font-medium text-foreground">
									#{item.id}
								</div>

								{/* Student */}
								<div className="col-span-4 sm:col-span-3 flex items-center gap-3 pl-2">
									<Avatar className="size-8 border border-border hidden sm:block">
										<AvatarImage
											src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.record.student.firstName}`}
										/>
										<AvatarFallback>
											{item.record.student.firstName[0]}
										</AvatarFallback>
									</Avatar>
									<span className="font-bold text-sm text-foreground truncate">
										{item.record.student.firstName}{" "}
										{item.record.student.lastName}
									</span>
								</div>

								{/* Date */}
								<div className="col-span-3 hidden md:flex flex-col">
									<div className="flex items-center gap-2">
										<div className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
										<span className="text-sm font-medium text-foreground">
											{item.signedAt.toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
												},
											)}
										</span>
									</div>
									<span className="text-xs text-muted-foreground pl-3.5">
										{item.signedAt.toLocaleTimeString(
											"en-US",
											{
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</span>
								</div>

								{/* Network */}
								<div className="col-span-2 hidden lg:flex">
									<NetworkBadge network={network} />
								</div>

								{/* Hash */}
								<div className="col-span-3 hidden xl:flex font-mono text-xs text-muted-foreground">
									{item.txHash}
								</div>

								{/* Actions */}
								<div className="col-span-6 sm:col-span-8 md:col-span-3 lg:col-span-3 xl:col-span-2 flex justify-end">
									<Button
										variant="ghost"
										size="sm"
										className="text-button-primary hover:text-button-primary hover:bg-button-primary/10 gap-1 text-xs font-semibold h-8"
									>
										View Cert{" "}
										<ArrowRight className="size-3" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>

				{/* Footer / Pagination */}
				<div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
					<span className="text-xs text-muted-foreground font-medium">
						Showing <span className="text-foreground">1</span> to{" "}
						<span className="text-foreground">5</span> of{" "}
						<span className="text-foreground">1,245</span> Entries
					</span>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="size-8 border-border"
							disabled
						>
							<ChevronLeft className="size-4" />
						</Button>
						<Button
							variant="secondary"
							size="sm"
							className="h-8 w-8 p-0 font-bold bg-muted-foreground/20 text-foreground"
						>
							1
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 text-muted-foreground"
						>
							2
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 text-muted-foreground"
						>
							3
						</Button>
						<span className="text-muted-foreground text-xs px-1">
							...
						</span>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 text-muted-foreground"
						>
							8
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-8 border-border"
						>
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Sub-components ---

function StatCard({
	label,
	value,
	icon: Icon,
	iconColor,
}: {
	label: string;
	value: string;
	icon: any;
	iconColor?: string;
}) {
	return (
		<Card className="flex-1 min-w-[140px] shadow-sm border-border bg-card">
			<CardContent className="p-4 flex flex-col justify-between h-full gap-3">
				<div className="flex justify-between items-start">
					<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
						{label}
					</span>
					<Icon
						className={`size-4 ${iconColor || "text-muted-foreground/40"}`}
					/>
				</div>
				<div className="text-2xl font-bold font-heading text-foreground">
					{value}
				</div>
			</CardContent>
		</Card>
	);
}

function NetworkBadge({ network }: { network: string }) {
	const styles: Record<string, string> = {
		Polygon: "bg-purple-100 text-purple-700 border-purple-200",
		Ethereum: "bg-emerald-100 text-emerald-700 border-emerald-200",
		Testnet: "bg-blue-100 text-blue-700 border-blue-200",
	};

	const style = styles[network] || styles.Testnet;

	return (
		<Badge
			variant="outline"
			className={`rounded-md px-2.5 py-0.5 font-semibold border ${style} shadow-none`}
		>
			{network}
		</Badge>
	);
}
