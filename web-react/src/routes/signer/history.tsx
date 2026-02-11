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
	ArrowUpRight,
	Calendar as CalendarIcon,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	ExternalLink,
	FileSignature,
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
		<div className="min-h-screen bg-muted/5 p-4 md:p-8 space-y-6 md:space-y-8">
			{/* --- Header Section --- */}
			<div className="flex flex-col xl:flex-row justify-between items-start gap-6 max-w-7xl mx-auto">
				<div className="space-y-3 md:space-y-4 max-w-2xl">
					<div className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground shadow-sm">
						<ShieldCheck className="mr-1 size-3 text-purple-600" />
						Secure Audit Log
					</div>
					<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
						Signature Audit Trail
					</h1>
					<p className="text-muted-foreground text-base md:text-lg leading-relaxed">
						Review and verify all academic credentials you have
						cryptographically signed on-chain.
					</p>
				</div>

				{/* Stats Grid - Responsive Bento */}
				<div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-3 w-full xl:w-[500px] shrink-0">
					<Card className="shadow-sm border-border/60">
						<CardContent className="p-4 flex flex-col justify-between h-full gap-2">
							<FileSignature className="size-4 text-primary" />
							<div>
								<div className="text-2xl font-bold">
									{totalSigned.toLocaleString()}
								</div>
								<p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
									Total Signed
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-sm border-border/60">
						<CardContent className="p-4 flex flex-col justify-between h-full gap-2">
							<Clock className="size-4 text-blue-600" />
							<div>
								<div className="text-2xl font-bold">
									{lastSignedDate
										? format(
												new Date(lastSignedDate),
												"MMM dd",
											)
										: "—"}
								</div>
								<p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
									Last Activity
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="col-span-2 shadow-sm border-border/60 bg-gradient-to-br from-background to-green-50/30">
						<CardContent className="p-4 flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
									Success Rate
								</p>
								<div className="text-3xl font-bold text-green-600">
									{successRate}%
								</div>
							</div>
							<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
								<CheckCircle2 className="size-6 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* --- Main Content Area --- */}
			<div className="max-w-7xl mx-auto space-y-4">
				{/* Responsive Toolbar */}
				<div className="bg-card border rounded-xl p-3 md:p-4 shadow-sm space-y-3 md:space-y-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="relative w-full md:max-w-xs lg:max-w-md group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
						<Input
							placeholder="Search Student or Hash..."
							className="pl-10 h-10 bg-muted/20"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Select defaultValue="all">
							<SelectTrigger className="w-full md:w-[140px] h-10 bg-muted/20">
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

						<Button
							variant="outline"
							className="flex-1 md:flex-none h-10 gap-2"
						>
							<CalendarIcon className="size-4" />
							<span className="hidden sm:inline">Date</span>
						</Button>

						<Button className="flex-1 md:flex-none h-10 bg-purple-600 hover:bg-purple-700 text-white">
							<Download className="size-4 mr-2" />
							Export
						</Button>
					</div>
				</div>

				{/* --- Audit Table / Card List --- */}
				<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
					<Table className="w-full">
						<TableHeader className="hidden md:table-header-group bg-muted/30">
							<TableRow className="border-b border-border/60">
								<TableHead className="pl-6 h-12 text-xs font-bold uppercase">
									ID
								</TableHead>
								<TableHead className="text-xs font-bold uppercase">
									Student Details
								</TableHead>
								<TableHead className="text-xs font-bold uppercase">
									Timestamp
								</TableHead>
								<TableHead className="text-xs font-bold uppercase">
									type
								</TableHead>
								<TableHead className="text-xs font-bold uppercase">
									credential ref
								</TableHead>
								<TableHead className="text-xs font-bold uppercase">
									Tx Hash
								</TableHead>
								<TableHead className="text-right pr-6 text-xs font-bold uppercase">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody className="block md:table-row-group">
							{filteredRecords.length === 0 ? (
								<TableRow className="block md:table-row">
									<TableCell
										colSpan={6}
										className="h-64 text-center block md:table-cell"
									>
										<div className="flex flex-col items-center justify-center gap-2">
											<Search className="size-8 text-muted-foreground/50" />
											<p className="font-medium">
												No signatures found
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredRecords.map((item) => {
									return (
										<TableRow
											key={item.id}
											className="block md:table-row border-b border-border/40 hover:bg-muted/30 transition-colors p-4 md:p-0"
										>
											{/* Mobile ID and Student Info */}
											<TableCell className="block md:table-cell py-1 md:py-4 md:pl-6">
												<div className="flex justify-between md:block">
													<span className="text-[10px] font-mono text-muted-foreground md:text-sm">
														#
														{item.record.id.slice(
															0,
															4,
														) || "8821"}
													</span>
													<div className="md:mt-1">
														<div className="font-bold text-sm md:font-semibold">
															{
																item.record
																	.student
																	.firstName
															}{" "}
															{
																item.record
																	.student
																	.lastName
															}
														</div>
														<div className="text-xs text-muted-foreground md:hidden">
															{item.record.student
																.student_id ||
																"ST-2024-001"}
														</div>
													</div>
												</div>
											</TableCell>

											<TableCell className="hidden md:table-cell">
												<span className="text-xs text-muted-foreground">
													{item.record.student
														.student_id ||
														"ST-2024-001"}
												</span>
											</TableCell>

											{/* Timestamp & Network - Grouped on Mobile */}
											<TableCell className="block md:table-cell py-1 md:py-4">
												<div className="flex items-center justify-between md:flex-col md:items-start gap-1">
													<div className="text-xs md:text-sm text-foreground/80">
														{format(
															new Date(
																item.signedAt,
															),
															"MMM dd, yyyy",
														)}
														<span className="md:block md:text-xs md:text-muted-foreground ml-2 md:ml-0">
															{format(
																new Date(
																	item.signedAt,
																),
																"hh:mm a",
															)}
														</span>
													</div>
													<Badge
														variant="outline"
														className={cn(
															"text-[10px] px-2 py-0 md:hidden",
														)}
													>
														{item.record
															.credentialType
															?.name || "Mainnet"}
													</Badge>
												</div>
											</TableCell>

											{/* type */}
											<TableCell className="hidden md:table-cell">
												<Badge
													variant="outline"
													className={cn(
														"rounded-md font-medium px-2.5 py-0.5",
													)}
												>
													{item.record.credentialType
														?.name ||
														"Polygon Mainnet"}
												</Badge>
											</TableCell>

											{/* Credential ref */}
											<TableCell className="block md:table-cell py-2 md:py-4">
												<div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-muted-foreground bg-muted/30 p-1.5 rounded w-fit md:w-full max-w-[150px]">
													<span className="truncate">
														{
															item.record
																.credentialRef
														}
													</span>
												</div>
											</TableCell>

											{/* Tx Hash */}
											<TableCell className="block md:table-cell py-2 md:py-4">
												<div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-muted-foreground bg-muted/30 p-1.5 rounded w-fit md:w-full max-w-[150px]">
													<span className="truncate">
														{item.txHash}
													</span>
													<ExternalLink className="size-3 shrink-0" />
												</div>
											</TableCell>

											{/* Action */}
											<TableCell className="block md:table-cell py-2 md:py-4 md:pr-6 text-right">
												<Button
													asChild
													variant="outline"
													size="sm"
													className="w-full md:w-auto text-button-primary hover:bg-button-primary font-bold h-9 gap-1"
												>
													<a
														href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
														target="_blank"
														rel="noreferrer"
														className="flex items-center gap-1 hover:text-white transition-colors"
													>
														View Explorer{" "}
														<ArrowUpRight className="size-3" />
													</a>
												</Button>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>

					{/* Footer Pagination - Responsive */}
					<div className="bg-muted/10 p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4">
						<span className="text-xs text-muted-foreground">
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

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								className="size-8"
								disabled
							>
								<ChevronLeft className="size-4" />
							</Button>
							<div className="flex items-center gap-1">
								<Button
									size="sm"
									className="size-8 p-0 bg-purple-600"
								>
									1
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="size-8 p-0"
								>
									2
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
