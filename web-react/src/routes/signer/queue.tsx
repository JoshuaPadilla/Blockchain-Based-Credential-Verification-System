import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { CredentialTypeEnum } from "@/enums/credential_type.enum";
import { cn } from "@/lib/utils";
import { useRecordStore } from "@/stores/record_store";
import { useSignersStore } from "@/stores/signer_store";
import type { Record } from "@/types/record.type";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	CalendarDays,
	CheckCircle2,
	Eye,
	Feather,
	Filter,
	Loader2,
	Search,
	ShieldCheck,
	SlidersHorizontal,
	X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signer/queue")({
	component: SignerQueuePage,
	loader: async ({ context }) => {
		await Promise.all([
			context.insights.getSingerDashboardInsights(),
			context.records.getSignerRecordsToSign(),
		]);
	},
});

function SignerQueuePage() {
	const router = useRouter();
	const { signerPendingRecords } = useRecordStore();
	const { signRecords } = useSignersStore();

	// --- State ---
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<string>("ALL");
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isSigning, setIsSigning] = useState(false);

	// --- Derived Data ---
	const filteredRecords = signerPendingRecords.filter((record) => {
		const searchLower = searchQuery.toLowerCase();
		const matchesSearch =
			record.student.firstName.toLowerCase().includes(searchLower) ||
			record.student.lastName.toLowerCase().includes(searchLower) ||
			record.student.student_id.toLowerCase().includes(searchLower);

		const matchesType =
			filterType === "ALL" || record.credentialType.name === filterType;

		return matchesSearch && matchesType;
	});

	const selectedRecords = signerPendingRecords.filter((r) =>
		selectedIds.includes(r.id),
	);

	// --- Handlers ---
	const toggleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedIds(filteredRecords.map((r) => r.id));
		} else {
			setSelectedIds([]);
		}
	};

	const toggleSelection = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id],
		);
	};

	const handleOpenSigningSheet = () => {
		if (selectedIds.length > 0) {
			setIsSheetOpen(true);
		}
	};

	const handleConfirmSign = async () => {
		try {
			setIsSigning(true);
			await signRecords(selectedIds);
		} catch (e) {
			console.error(e);
		} finally {
			setIsSigning(false);
			setIsSheetOpen(false);
			setSelectedIds([]);
			router.navigate({ to: "/signer/signing-summary" }); // Fixed redirect path to dashboard
		}
	};

	const currentBatchDate = new Date().toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<div className="min-h-screen bg-background font-sans text-foreground p-4 sm:p-6 pb-32">
			{/* Header */}
			<div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
							Pending Credentials
						</h1>
						<p className="text-muted-foreground mt-2 text-sm max-w-lg">
							Review and cryptographically sign student
							credentials in bulk.
						</p>
					</div>
					<div className="flex flex-col items-start md:items-end w-full md:w-auto">
						<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
							Academic Session
						</span>
						<div className="flex items-center gap-2 mt-1">
							<CalendarDays className="size-4 text-button-primary" />
							<span className="font-bold text-lg">
								{currentBatchDate} Batch
							</span>
						</div>
					</div>
				</div>

				{/* Toolbar */}
				<div className="bg-card p-2 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-2 items-stretch md:items-center sticky top-4 z-20">
					<div className="flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border min-w-fit">
						<Checkbox
							id="select-all"
							checked={
								selectedIds.length === filteredRecords.length &&
								filteredRecords.length > 0
							}
							onCheckedChange={toggleSelectAll}
							className="data-[state=checked]:bg-button-primary data-[state=checked]:border-button-primary"
						/>
						<label
							htmlFor="select-all"
							className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
						>
							Select All
						</label>
					</div>

					<div className="flex flex-col sm:flex-row items-center gap-2 flex-1 w-full px-2 pt-2 md:pt-0">
						<Select
							value={filterType}
							onValueChange={setFilterType}
						>
							<SelectTrigger className="w-full sm:w-[180px] border-input bg-background focus:ring-button-primary h-10">
								<SelectValue placeholder="Credential Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">
									All Credentials
								</SelectItem>
								{Object.values(CredentialTypeEnum).map(
									(type) => (
										<SelectItem key={type} value={type}>
											{type.replace(/_/g, " ")}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>

						<div className="relative w-full md:w-80">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								placeholder="Search Student Name or ID..."
								className="pl-9 border-input bg-background focus-visible:ring-button-primary h-10 w-full"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{/* List Grid */}
				<div className="space-y-3">
					{filteredRecords.length === 0 ? (
						<div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
							<div className="mx-auto size-12 bg-secondary rounded-full flex items-center justify-center mb-3">
								<Filter className="size-6 text-muted-foreground" />
							</div>
							<p className="text-muted-foreground font-medium">
								No pending credentials found.
							</p>
						</div>
					) : (
						filteredRecords.map((record) => (
							<QueueItem
								key={record.id}
								record={record}
								isSelected={selectedIds.includes(record.id)}
								onToggle={() => toggleSelection(record.id)}
							/>
						))
					)}
				</div>
			</div>

			{/* Floating Action Bar */}
			<div
				className={cn(
					"fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-3xl transition-all duration-300 ease-in-out z-30",
					selectedIds.length > 0
						? "translate-y-0 opacity-100"
						: "translate-y-20 opacity-0 pointer-events-none",
				)}
			>
				<div className="bg-primary text-primary-foreground p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 ring-1 ring-white/10">
					<div className="flex items-center gap-4 w-full sm:w-auto">
						<div className="bg-background/20 p-2.5 rounded-xl hidden xs:block">
							<SlidersHorizontal className="size-5 text-button-primary" />
						</div>
						<div className="flex-1 sm:flex-initial">
							<p className="font-bold text-sm">
								{selectedIds.length} Students Selected
							</p>
							<p className="text-xs text-primary-foreground/70 hidden sm:block">
								Ready for cryptographic signature
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
						<Button
							variant="ghost"
							className="flex-1 sm:flex-initial text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
							onClick={() => setSelectedIds([])}
						>
							Cancel
						</Button>
						<Button
							className="flex-1 sm:flex-initial bg-button-primary hover:bg-button-primary/90 text-white font-semibold shadow-lg shadow-button-primary/20 whitespace-nowrap"
							onClick={handleOpenSigningSheet}
						>
							<Feather className="mr-2 size-4" /> Sign (
							{selectedIds.length})
						</Button>
					</div>
				</div>
			</div>

			{/* Signing Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="w-full sm:max-w-md flex flex-col h-full sm:h-auto">
					<SheetHeader className="space-y-4">
						<SheetTitle className="flex items-center gap-2 text-xl">
							<ShieldCheck className="size-6 text-button-primary" />
							Confirm Signature
						</SheetTitle>
						<SheetDescription>
							You are about to cryptographically sign{" "}
							<strong>
								{selectedRecords.length} credentials
							</strong>
							. This action is immutable and will be recorded on
							the blockchain.
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto my-6 pr-2 -mr-2 max-h-[60vh]">
						<div className="space-y-3">
							{selectedRecords.map((record) => (
								<div
									key={record.id}
									className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border"
								>
									<Avatar className="size-10 border border-border bg-background">
										<AvatarImage
											src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.student.firstName}`}
										/>
										<AvatarFallback className="text-xs">
											{record.student.firstName[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-foreground truncate">
											{record.student.firstName}{" "}
											{record.student.lastName}
										</p>
										<p className="text-xs text-muted-foreground truncate font-mono">
											{record.credentialType.name} •{" "}
											{record.student.student_id}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="size-6 text-muted-foreground hover:text-destructive"
										onClick={() =>
											toggleSelection(record.id)
										}
									>
										<X className="size-3" />
									</Button>
								</div>
							))}
						</div>
					</div>

					<SheetFooter className="flex-col gap-3 sm:flex-col mt-auto">
						<div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-3 mb-2">
							<CheckCircle2 className="size-5 text-yellow-600 shrink-0" />
							<p className="text-xs text-yellow-800 leading-snug">
								By clicking Confirm, you certify that you have
								verified the integrity of these records.
							</p>
						</div>
						<Button
							className="w-full h-11 bg-button-primary hover:bg-button-primary/90"
							onClick={handleConfirmSign}
							disabled={isSigning || selectedRecords.length === 0}
						>
							{isSigning ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />{" "}
									Signing...
								</>
							) : (
								"Confirm & Sign"
							)}
						</Button>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => setIsSheetOpen(false)}
						>
							Cancel
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}

const QueueItem = ({
	record,
	isSelected,
	onToggle,
}: {
	record: Record;
	isSelected: boolean;
	onToggle: () => void;
}) => {
	return (
		<div
			className={cn(
				"group relative bg-card p-3 sm:p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 sm:gap-5 cursor-pointer hover:shadow-lg overflow-hidden",
				isSelected
					? "border-button-primary/50 shadow-md ring-1 ring-button-primary/20 bg-button-primary/[0.02]"
					: "border-border hover:border-button-primary/30",
			)}
			onClick={onToggle}
		>
			<div
				className={cn(
					"absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
					isSelected ? "bg-button-primary" : "bg-transparent",
				)}
			/>
			<div className="flex items-center justify-center pl-0 sm:pl-2">
				<Checkbox
					checked={isSelected}
					className="size-5 rounded-md transition-all border-muted-foreground/30 data-[state=checked]:bg-button-primary data-[state=checked]:border-button-primary"
				/>
			</div>
			<Avatar className="size-10 sm:size-12 border border-border bg-background shadow-sm shrink-0">
				<AvatarImage
					src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.student.firstName}`}
				/>
				<AvatarFallback className="bg-button-primary/10 text-button-primary font-bold font-heading">
					{record.student.firstName[0]}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<div className="flex flex-col gap-0.5">
					<h3 className="font-heading font-bold text-foreground text-base sm:text-lg leading-none tracking-tight truncate">
						{record.student.firstName} {record.student.middleName}{" "}
						{record.student.lastName}
					</h3>
					<div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
						<span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground whitespace-nowrap">
							{record.student.student_id}
						</span>
						<span className="hidden sm:inline-block text-border">
							•
						</span>
						<span
							className="truncate font-medium block max-w-[150px] sm:max-w-none"
							title={record.student.course}
						>
							{record.student.course}
						</span>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 sm:gap-4 shrink-0">
				<Badge
					variant="outline"
					className="bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary transition-colors px-3 py-1 font-medium whitespace-nowrap hidden sm:inline-flex"
				>
					{record.credentialType.name}
				</Badge>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 sm:size-9 text-muted-foreground hover:text-button-primary hover:bg-button-primary/10 rounded-full transition-colors"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Eye className="size-4 sm:size-5" />
				</Button>
			</div>
		</div>
	);
};
