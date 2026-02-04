import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRecordSignatureStore } from "@/stores/record_signature_store";
import { useSignersStore } from "@/stores/signer_store";
import type { RecordSignature } from "@/types/record_signature";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowUpRight,
	Check,
	CheckCircle2,
	Copy,
	Download,
	FileCheck,
	FileText,
	Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Assuming you have a toast library, or use console

export const Route = createFileRoute("/signer/signing-summary")({
	component: SigningSummaryPage,
	beforeLoad: ({ context }) => {
		if (!context.signer.signingResultData) {
			throw redirect({ to: "/signer/queue" });
		}
	},
});

function SigningSummaryPage() {
	const navigate = useNavigate();
	const { signingResultData } = useSignersStore();
	const { getRecordSignature } = useRecordSignatureStore();

	const [signatures, setSignatures] = useState<RecordSignature[]>([]);
	const [isLoadingDetails, setIsLoadingDetails] = useState(true);

	const result = signingResultData!;

	useEffect(() => {
		const fetchSignatures = async () => {
			if (!result.signatureIds || result.signatureIds.length === 0) {
				setIsLoadingDetails(false);
				return;
			}

			try {
				const results = await Promise.all(
					result.signatureIds.map((id) => getRecordSignature(id)),
				);
				setSignatures(results.filter((s): s is RecordSignature => !!s));
			} catch (error) {
				console.error("Failed to fetch signature details", error);
			} finally {
				setIsLoadingDetails(false);
			}
		};

		fetchSignatures();
	}, [result.signatureIds, getRecordSignature]);

	const totalProcessed = result.signedCount + result.rejectedCount;
	const successRate =
		totalProcessed > 0
			? Math.round((result.signedCount / totalProcessed) * 100)
			: 0;

	const copyHash = () => {
		navigator.clipboard.writeText(result.txHash);
		toast.success("Transaction hash copied");
	};

	return (
		<div className="min-h-screen bg-muted/30 font-sans text-foreground pb-20">
			{/* Decorative Top Background */}
			<div className="h-64 w-full bg-gradient-to-b from-green-50 to-transparent absolute top-0 left-0 -z-10" />

			<div className="container max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* --- 1. Header Section --- */}
				<div className="flex flex-col items-center text-center space-y-6">
					<div className="relative">
						<div className="size-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50">
							<Check
								className="size-10 text-green-600 animate-in zoom-in duration-300 delay-150"
								strokeWidth={4}
							/>
						</div>
						{/* Pulsing ring effect */}
						<div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping" />
					</div>

					<div className="space-y-2">
						<h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
							Batch Signing Complete
						</h1>
						<p className="text-muted-foreground text-lg max-w-lg mx-auto">
							<span className="font-semibold text-foreground">
								{result.signedCount} credentials
							</span>{" "}
							have been successfully anchored to the Ethereum
							Mainnet.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* --- LEFT COL: Transaction Receipt --- */}
					<div className="lg:col-span-2 space-y-6">
						<Card className="border-border shadow-sm overflow-hidden">
							<CardHeader className="pb-4 border-b bg-muted/20">
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<CardTitle className="text-lg flex items-center gap-2">
											<FileCheck className="size-5 text-green-600" />
											Manifest Summary
										</CardTitle>
										<CardDescription>
											Batch ID:{" "}
											{
												new Date()
													.toISOString()
													.split("T")[0]
											}
											-{result.blocknumber}
										</CardDescription>
									</div>
									<Badge
										variant="outline"
										className="bg-background text-green-700 border-green-200 px-3 py-1"
									>
										{successRate}% Success Rate
									</Badge>
								</div>
							</CardHeader>

							<CardContent className="p-0">
								{/* Custom Scrollable List Area */}
								<div className="max-h-[500px] overflow-y-auto custom-scrollbar">
									<div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b px-6 py-3 grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										<div className="col-span-6">
											Student
										</div>
										<div className="col-span-4">
											Record ID
										</div>
										<div className="col-span-2 text-right">
											Status
										</div>
									</div>

									<div className="divide-y divide-border">
										{isLoadingDetails ? (
											<div className="p-8 text-center text-muted-foreground text-sm">
												Retrieving anchored records...
											</div>
										) : (
											signatures.map((sig, i) => (
												<div
													key={sig.id || i}
													className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors group"
												>
													<div className="col-span-6 flex items-center gap-3">
														<Avatar className="size-9 border bg-white">
															<AvatarImage
																src={`https://api.dicebear.com/7.x/initials/svg?seed=${sig.record.student?.firstName}`}
															/>
															<AvatarFallback className="text-xs">
																{
																	sig.record
																		.student
																		?.firstName?.[0]
																}
															</AvatarFallback>
														</Avatar>
														<div className="min-w-0">
															<p className="font-medium text-sm truncate">
																{
																	sig.record
																		.student
																		?.firstName
																}{" "}
																{
																	sig.record
																		.student
																		?.lastName
																}
															</p>
															<p className="text-xs text-muted-foreground">
																Class of 2024
															</p>
														</div>
													</div>

													<div className="col-span-4 flex items-center gap-2 min-w-0">
														<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-foreground truncate">
															{sig.id.substring(
																0,
																12,
															)}
															...
														</code>
														{/* Copy button that appears on hover */}
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
																	>
																		<Copy className="size-3 text-muted-foreground" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	Copy ID
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>

													<div className="col-span-2 text-right">
														<CheckCircle2 className="size-5 text-green-500 ml-auto" />
													</div>
												</div>
											))
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions Bar */}
						<div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-2">
							<Button
								variant="outline"
								className="gap-2"
								onClick={() =>
									navigate({ to: "/signer/queue" })
								}
							>
								<ArrowLeft className="size-4" />
								Return to Queue
							</Button>

							<div className="flex gap-3">
								<Button variant="outline" className="gap-2">
									<Share2 className="size-4" />
									Share
								</Button>
								<Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
									<Download className="size-4" />
									Download Receipt
								</Button>
							</div>
						</div>
					</div>

					{/* --- RIGHT COL: Network Details --- */}
					<div className="space-y-6">
						<Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-xl">
							<CardHeader>
								<CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">
									Blockchain Proof
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* TX Hash Block */}
								<div className="space-y-2">
									<div className="flex items-center justify-between text-xs text-slate-400">
										<span>Transaction Hash</span>
										<a
											href={`https://etherscan.io/tx/${result.txHash}`}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-1 hover:text-white transition-colors"
										>
											View Explorer{" "}
											<ArrowUpRight className="size-3" />
										</a>
									</div>
									<div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center justify-between gap-2 group">
										<code className="text-xs font-mono text-slate-300 break-all line-clamp-2">
											{result.txHash}
										</code>
										<Button
											onClick={copyHash}
											size="icon"
											variant="ghost"
											className="size-8 shrink-0 text-slate-500 hover:text-white hover:bg-slate-800"
										>
											<Copy className="size-4" />
										</Button>
									</div>
								</div>

								<Separator className="bg-slate-800" />

								{/* Stats Grid */}
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<span className="text-xs text-slate-500">
											Block Height
										</span>
										<div className="font-mono text-lg font-bold text-blue-400">
											#{result.blocknumber}
										</div>
									</div>
									<div className="space-y-1">
										<span className="text-xs text-slate-500">
											Gas Used
										</span>
										<div className="font-mono text-lg font-bold text-orange-400">
											{result.totalGasUsed.toLocaleString()}
										</div>
									</div>
									<div className="space-y-1">
										<span className="text-xs text-slate-500">
											Gas Price
										</span>
										<div className="font-mono text-sm font-semibold">
											{result.gasPrice} Gwei
										</div>
									</div>
									<div className="space-y-1">
										<span className="text-xs text-slate-500">
											Network
										</span>
										<div className="font-mono text-sm font-semibold">
											Mainnet
										</div>
									</div>
								</div>

								<div className="bg-green-900/20 border border-green-900/50 rounded-lg p-3 flex items-start gap-3">
									<div className="mt-0.5 bg-green-500/20 p-1 rounded-full">
										<Check className="size-3 text-green-400" />
									</div>
									<div className="space-y-0.5">
										<p className="text-sm font-medium text-green-400">
											Confirmed
										</p>
										<p className="text-xs text-green-400/70">
											All records are immutable and
											publicly verifiable.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Audit Link */}
						<Card className="bg-background border-dashed">
							<CardContent className="p-4 flex items-center gap-4">
								<div className="bg-muted p-2 rounded-full">
									<FileText className="size-5 text-muted-foreground" />
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium">
										Compliance Audit
									</p>
									<p className="text-xs text-muted-foreground">
										Generate a PDF report for internal logs.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
