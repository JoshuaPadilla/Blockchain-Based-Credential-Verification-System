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
import { CredentialTypeEnum } from "@/enums/credential_type.enum";
import { cn } from "@/lib/utils";
import { useRecordStore } from "@/stores/record_store";
import type { Record } from "@/types/record.type";
import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarDays,
	Eye,
	Feather,
	Filter,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signer/queue")({
	component: SignerQueuePage,
	loader: async ({ context }) => {
		const user = context.auth.user;
		if (!user) return;

		await Promise.all([
			context.insights.getSingerDashboardInsights(user.id),
			context.records.getSignerPendingRecords(user.id),
		]);
	},
});

function SignerQueuePage() {
	const { signerPendingRecords } = useRecordStore();

	// --- State ---
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<string>("ALL");

	// --- Derived Data ---
	const filteredRecords = signerPendingRecords.filter((record) => {
		const matchesSearch =
			record.student.firstName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			record.student.lastName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			record.student.student_id
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesType =
			filterType === "ALL" || record.credentialType.name === filterType;

		return matchesSearch && matchesType;
	});

	// --- Handlers ---
	const toggleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedIds(filteredRecords.map((r: Record) => r.id));
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

	const handleSignSelected = () => {
		console.log("Signing records:", selectedIds);
		alert(
			`Initiating cryptographic signature for ${selectedIds.length} records...`,
		);
	};

	const currentBatchDate = new Date().toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<div className="min-h-screen bg-background font-sans text-foreground p-6 pb-32">
			{/* --- Header Section --- */}
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
					<div>
						<h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
							Pending Credentials
						</h1>
						<p className="text-muted-foreground mt-2 text-sm max-w-lg">
							Review and cryptographically sign student
							credentials in bulk. Ensure all data is correct
							before anchoring to the blockchain.
						</p>
					</div>
					<div className="flex flex-col items-end">
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

				{/* --- Toolbar --- */}
				<div className="bg-card p-2 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-2 items-center sticky top-4 z-20">
					{/* Select All Checkbox Wrapper */}
					<div className="flex items-center gap-3 px-4 py-2 border-r border-border min-w-fit">
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

					{/* Filters */}
					<div className="flex items-center gap-2 flex-1 w-full px-2">
						<Select
							value={filterType}
							onValueChange={setFilterType}
						>
							<SelectTrigger className="w-[180px] border-input bg-background focus:ring-button-primary h-10">
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
					</div>

					{/* Search */}
					<div className="relative w-full md:w-80">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="Search Student Name or ID..."
							className="pl-9 border-input bg-background focus-visible:ring-button-primary h-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* --- List Grid --- */}
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
						filteredRecords.map((record: Record) => (
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

			{/* --- Floating Action Bar (Bottom) --- */}
			<div
				className={cn(
					"fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 transition-all duration-300 ease-in-out z-30",
					selectedIds.length > 0
						? "translate-y-0 opacity-100"
						: "translate-y-20 opacity-0 pointer-events-none",
				)}
			>
				<div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl flex items-center justify-between ring-1 ring-white/10">
					<div className="flex items-center gap-4">
						<div className="bg-background/20 p-2.5 rounded-xl">
							<SlidersHorizontal className="size-5 text-button-primary" />
						</div>
						<div>
							<p className="font-bold text-sm">
								{selectedIds.length} Students Selected
							</p>
							<p className="text-xs text-primary-foreground/70">
								Ready for cryptographic signature
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
							onClick={() => setSelectedIds([])}
						>
							Cancel
						</Button>
						<Button
							className="bg-button-primary hover:bg-button-primary/90 text-white font-semibold shadow-lg shadow-button-primary/20"
							onClick={handleSignSelected}
						>
							<Feather className="mr-2 size-4" /> Sign Selected (
							{selectedIds.length})
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Enhanced Individual Card Component ---
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
				"group relative bg-card p-4 rounded-xl border transition-all duration-300 flex items-center gap-5 cursor-pointer hover:shadow-lg overflow-hidden",
				isSelected
					? "border-button-primary/50 shadow-md ring-1 ring-button-primary/20 bg-button-primary/[0.02]"
					: "border-border hover:border-button-primary/30",
			)}
			onClick={onToggle}
		>
			{/* Active Indicator Bar (Left) */}
			<div
				className={cn(
					"absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
					isSelected ? "bg-button-primary" : "bg-transparent",
				)}
			/>

			{/* Checkbox Section */}
			<div className="flex items-center justify-center pl-2">
				<Checkbox
					checked={isSelected}
					className={cn(
						"size-5 rounded-md transition-all border-muted-foreground/30 data-[state=checked]:bg-button-primary data-[state=checked]:border-button-primary",
						isSelected ? "scale-100" : "scale-100",
					)}
				/>
			</div>

			{/* Avatar */}
			<Avatar className="size-12 border border-border bg-background shadow-sm">
				<AvatarImage
					src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.student.firstName}`}
				/>
				<AvatarFallback className="bg-button-primary/10 text-button-primary font-bold font-heading">
					{record.student.firstName[0]}
				</AvatarFallback>
			</Avatar>

			{/* Student Details */}
			<div className="flex-1 min-w-0">
				<div className="flex flex-col gap-0.5">
					<h3 className="font-heading font-bold text-foreground text-lg leading-none tracking-tight">
						{record.student.firstName} {record.student.middleName}{" "}
						{record.student.lastName}
					</h3>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
							{record.student.student_id}
						</span>
						<span className="hidden sm:inline-block text-border">
							•
						</span>
						<span
							className="truncate font-medium"
							title={record.student.course}
						>
							{record.student.course}
						</span>
					</div>
				</div>
			</div>

			{/* Badge & Actions (Right Side) */}
			<div className="flex items-center gap-4">
				<Badge
					variant="outline"
					className="bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary transition-colors px-3 py-1 font-medium whitespace-nowrap hidden sm:inline-flex"
				>
					{record.credentialType.name}
				</Badge>

				<Button
					variant="ghost"
					size="icon"
					className="size-9 text-muted-foreground hover:text-button-primary hover:bg-button-primary/10 rounded-full transition-colors"
					onClick={(e) => {
						e.stopPropagation();
						// Add view details logic here
					}}
				>
					<Eye className="size-5" />
				</Button>
			</div>
		</div>
	);
};
