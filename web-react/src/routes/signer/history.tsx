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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useInsightsStore } from "@/stores/insights_store";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowRight,
	Calendar as CalendarIcon,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	FileSignature,
	Filter,
	MoreHorizontal,
	Search,
	ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/signer/history")({
	component: SignerHistoryPage,
	loader: async ({ context }) => {
		await context.insights.getSignerHistoryInsights();
	},
});

function SignerHistoryPage() {
	const { signerHistoryInsights } = useInsightsStore();
	const [searchQuery, setSearchQuery] = useState("");

	const { totalSigned, lastSignedDate, successRate, recordSignatures } =
		signerHistoryInsights || {
			totalSigned: 0,
			lastSignedDate: null,
			successRate: 0,
			recordSignatures: [],
		};

	const filteredRecords = useMemo(() => {
		if (!searchQuery) return recordSignatures;
		const lowerQuery = searchQuery.toLowerCase();
		return recordSignatures.filter(
			(sig) =>
				sig.record.student.firstName
					.toLowerCase()
					.includes(lowerQuery) ||
				sig.record.student.lastName
					.toLowerCase()
					.includes(lowerQuery) ||
				sig.record.student.student_id
					.toLowerCase()
					.includes(lowerQuery) ||
				sig.txHash.toLowerCase().includes(lowerQuery),
		);
	}, [recordSignatures, searchQuery]);

	return (
		<div className="min-h-screen bg-muted/5 p-4 md:p-8 space-y-8">
			{/* --- Top Section: Header & Stats --- */}
			<div className="flex flex-col xl:flex-row justify-between items-start gap-8 max-w-7xl mx-auto">
				{/* Title Area */}
				<div className="space-y-4 max-w-2xl py-2">
					<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
						<ShieldCheck className="mr-1 size-3 text-purple-600" />
						Secure Audit Log
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
						Signature Audit Trail
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Review and verify all academic credentials you have
						cryptographically signed on-chain. Track timestamps,
						transaction hashes, and student details.
					</p>
				</div>

				{/* Stats Grid - "Bento" Style */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:w-[500px] shrink-0">
					<Card className="shadow-sm border-border/60 bg-card hover:border-purple-200 transition-colors">
						<CardContent className="p-5 flex flex-col justify-between h-full gap-2">
							<div className="flex justify-between items-start">
								<span className="text-sm font-medium text-muted-foreground">
									Total Signed
								</span>
								<div className="bg-primary/10 p-2 rounded-lg">
									<FileSignature className="size-4 text-primary" />
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold tracking-tight">
									{totalSigned.toLocaleString()}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									Credentials Issued
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-sm border-border/60 bg-card hover:border-blue-200 transition-colors">
						<CardContent className="p-5 flex flex-col justify-between h-full gap-2">
							<div className="flex justify-between items-start">
								<span className="text-sm font-medium text-muted-foreground">
									Last Activity
								</span>
								<div className="bg-blue-50 p-2 rounded-lg">
									<Clock className="size-4 text-blue-600" />
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold tracking-tight">
									{lastSignedDate
										? format(
												new Date(lastSignedDate),
												"MMM dd",
											)
										: "—"}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{lastSignedDate
										? format(
												new Date(lastSignedDate),
												"yyyy",
											)
										: "No Data"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="col-span-1 sm:col-span-2 shadow-sm border-border/60 bg-card hover:border-green-200 transition-colors">
						<CardContent className="p-5 flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="text-sm font-medium text-muted-foreground">
									Success Rate
								</span>
								<div className="text-3xl font-bold tracking-tight text-green-600">
									{successRate}%
								</div>
								<span className="text-xs text-muted-foreground">
									Tx Finality Reached
								</span>
							</div>
							<div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100">
								<CheckCircle2 className="size-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* --- Main Content Area --- */}
			<div className="max-w-7xl mx-auto space-y-4">
				{/* Toolbar & Filter Card */}
				<div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative w-full md:max-w-md group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
						<Input
							placeholder="Search Student, ID, or Hash..."
							className="pl-10 h-11 bg-muted/20 border-transparent focus:bg-background focus:border-input transition-all"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
						<Button
							variant="outline"
							className="h-10 border-dashed text-muted-foreground hover:text-foreground"
						>
							<Filter className="mr-2 size-4" />
							Filters
						</Button>

						<div className="h-6 w-px bg-border hidden md:block mx-1" />

						<Select defaultValue="all">
							<SelectTrigger className="w-[160px] h-10 border-0 bg-muted/30 hover:bg-muted/50 focus:ring-0">
								<SelectValue placeholder="Network" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Networks
								</SelectItem>
								<SelectItem value="polygon">Polygon</SelectItem>
								<SelectItem value="ethereum">
									Ethereum
								</SelectItem>
							</SelectContent>
						</Select>

						<Button variant="outline" className="gap-2 h-10">
							<CalendarIcon className="size-4 text-muted-foreground" />
							<span>Date</span>
						</Button>

						<Button className="gap-2 h-10 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200">
							<Download className="size-4" />
							<span className="hidden sm:inline">Export CSV</span>
						</Button>
					</div>
				</div>

				{/* Table Card */}
				<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
					<Table>
						<TableHeader className="bg-muted/30">
							<TableRow className="hover:bg-transparent border-b border-border/60">
								<TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground h-12 pl-6">
									ID
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Student Details
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Timestamp
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Network
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Tx Hash
								</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right pr-6">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRecords.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-64 text-center"
									>
										<div className="flex flex-col items-center justify-center gap-2">
											<div className="bg-muted/50 p-4 rounded-full">
												<Search className="size-8 text-muted-foreground" />
											</div>
											<p className="font-medium text-lg text-foreground">
												No signatures found
											</p>
											<p className="text-muted-foreground text-sm">
												Try adjusting your search or
												filters.
											</p>
											<Button
												variant="link"
												onClick={() =>
													setSearchQuery("")
												}
												className="text-purple-600"
											>
												Clear Search
											</Button>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredRecords.map((item, index) => {
									const badgeVariant =
										index % 3 === 0
											? "bg-purple-50 text-purple-700 border-purple-200"
											: index % 3 === 1
												? "bg-emerald-50 text-emerald-700 border-emerald-200"
												: "bg-blue-50 text-blue-700 border-blue-200";

									return (
										<TableRow
											key={item.id}
											className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
										>
											<TableCell className="pl-6 font-medium text-muted-foreground text-sm py-4">
												#
												{item.record.id.slice(0, 4) ||
													"8821"}
											</TableCell>

											<TableCell>
												<div className="flex flex-col">
													<span className="font-semibold text-sm text-foreground">
														{
															item.record.student
																.firstName
														}{" "}
														{
															item.record.student
																.lastName
														}
													</span>
													<span className="text-xs text-muted-foreground">
														{item.record.student
															.student_id ||
															"ST-2024-001"}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<div className="flex items-center gap-2 text-sm">
													<span className="text-foreground/80">
														{format(
															new Date(
																item.signedAt,
															),
															"MMM dd, yyyy",
														)}
													</span>
													<span className="text-xs text-muted-foreground border-l pl-2">
														{format(
															new Date(
																item.signedAt,
															),
															"hh:mm a",
														)}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<Badge
													variant="outline"
													className={cn(
														"rounded-md font-medium px-2.5 py-0.5",
														badgeVariant,
													)}
												>
													{item.record.credentialType
														?.name ||
														"Polygon Mainnet"}
												</Badge>
											</TableCell>

											<TableCell className="max-w-[150px]">
												<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-muted/30 p-1.5 rounded w-fit">
													<span className="truncate max-w-[120px]">
														{item.txHash}
													</span>
												</div>
											</TableCell>

											<TableCell className="text-right pr-6">
												<Button
													variant="ghost"
													size="sm"
													className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium h-8 gap-1"
												>
													<span>Verify</span>
													<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>

					{/* Footer Pagination */}
					<div className="bg-muted/10 p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
						<span className="text-xs text-muted-foreground text-center sm:text-left">
							Showing{" "}
							<span className="font-bold text-foreground">
								1-{filteredRecords.length}
							</span>{" "}
							of{" "}
							<span className="font-bold text-foreground">
								{totalSigned.toLocaleString()}
							</span>{" "}
							entries
						</span>

						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="icon"
								className="size-8"
								disabled
							>
								<ChevronLeft className="size-4" />
							</Button>
							<div className="flex items-center gap-1 mx-2">
								<Button
									variant="secondary"
									size="sm"
									className="size-8 p-0 font-bold bg-purple-100 text-purple-700"
								>
									1
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="size-8 p-0 text-muted-foreground"
								>
									2
								</Button>
								<span className="text-xs text-muted-foreground px-1">
									<MoreHorizontal className="size-3" />
								</span>
								<Button
									variant="ghost"
									size="sm"
									className="size-8 p-0 text-muted-foreground"
								>
									8
								</Button>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="size-8"
							>
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
