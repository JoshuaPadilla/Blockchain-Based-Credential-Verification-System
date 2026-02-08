import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { RecentTransactionTable } from "@/components/custom_components/recent_transaction_table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CredentialTypeEnum } from "@/enums/credential_type.enum"; // Adjust path as needed
import { cn } from "@/lib/utils";
import { useRecordStore } from "@/stores/record_store";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon, FileDown, FilterX, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/admin/credentials/")({
	component: CredentialsPage,
	loader: async ({ context }) => {
		// Parallel data fetching for performance

		await Promise.all([
			context.insights.getAdminDashboardInsights(),
			context.records.getRecords(),
		]);
	},
	pendingComponent: () => <PendingSkeleton />,
});

function CredentialsPage() {
	const { adminRecords } = useRecordStore();

	// --- Filter States ---
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("ALL");
	const [statusFilter, setStatusFilter] = useState<string>("ALL");
	const [date, setDate] = useState<DateRange | undefined>(undefined);

	// --- Filtering Logic ---
	const filteredRecords = useMemo(() => {
		return adminRecords.filter((record) => {
			// 1. Text Search (Student Name, ID, or Credential Ref)
			const searchLower = searchTerm.toLowerCase();
			const matchesSearch =
				record.student.firstName.toLowerCase().includes(searchLower) ||
				record.student.lastName.toLowerCase().includes(searchLower) ||
				record.student.student_id.toLowerCase().includes(searchLower) ||
				record.credentialRef.toLowerCase().includes(searchLower);

			// 2. Credential Type Filter
			const matchesType =
				typeFilter === "ALL" ||
				record.credentialType.name === typeFilter;

			// 3. Status Filter (Active vs Revoked)
			// If 'REVOKED', we look for revoked: true. If 'ACTIVE', we look for revoked: false.
			const matchesStatus =
				statusFilter === "ALL"
					? true
					: statusFilter === "REVOKED"
						? record.revoked
						: !record.revoked; // ACTIVE

			// 4. Date Range Filter (CreatedAt)
			let matchesDate = true;
			if (date?.from) {
				const recordDate = new Date(record.createdAt);
				const fromDate = startOfDay(date.from);
				const toDate = date.to
					? addDays(date.to, 1)
					: addDays(date.from, 1); // Inclusive logic

				matchesDate =
					recordDate >= fromDate &&
					(date.to ? recordDate <= toDate : true);
			}

			return matchesSearch && matchesType && matchesStatus && matchesDate;
		});
	}, [adminRecords, searchTerm, typeFilter, statusFilter, date]);

	// --- Handlers ---
	const clearFilters = () => {
		setSearchTerm("");
		setTypeFilter("ALL");
		setStatusFilter("ALL");
		setDate(undefined);
	};

	return (
		<div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 p-8 space-y-8">
			{/* --- Page Header --- */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-heading font-extrabold tracking-tight text-slate-900">
						Credential Registry
					</h1>
					<p className="text-slate-500 text-sm mt-1">
						Manage and monitor all academic records issued on the
						blockchain.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="bg-white border-slate-200 text-slate-700"
					>
						<FileDown className="mr-2 size-4" /> Export CSV
					</Button>
					<Button className="bg-[var(--button-primary)] hover:opacity-90 shadow-sm">
						<Plus className="mr-2 size-4" /> Issue New
					</Button>
				</div>
			</div>

			{/* --- Search and Filter --- */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
				{/* Left Side: Text Search */}
				<div className="relative w-full xl:w-96">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
					<Input
						placeholder="Search student, ID, or reference..."
						className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[var(--button-primary)]"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Right Side: Structured Filters */}
				<div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
					{/* Date Picker */}
					<div className="grid gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date"
									variant={"outline"}
									className={cn(
										"w-[260px] justify-start text-left font-normal bg-slate-50 border-slate-200",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, "LLL dd, y")}{" "}
												- {format(date.to, "LLL dd, y")}
											</>
										) : (
											format(date.from, "LLL dd, y")
										)
									) : (
										<span>Filter by Date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="end">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={date?.from}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>

					{/* Credential Type Filter */}
					<Select value={typeFilter} onValueChange={setTypeFilter}>
						<SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
							<SelectValue placeholder="Credential Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All Types</SelectItem>
							{Object.values(CredentialTypeEnum).map((type) => (
								<SelectItem key={type} value={type}>
									{type.replace(/_/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Status Filter (Active/Revoked) */}
					<Select
						value={statusFilter}
						onValueChange={setStatusFilter}
					>
						<SelectTrigger className="w-[150px] bg-slate-50 border-slate-200">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All Statuses</SelectItem>
							<SelectItem value="ACTIVE">Active Only</SelectItem>
							<SelectItem value="REVOKED">
								Revoked Only
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Reset Button (Only shows if filters are active) */}
					{(searchTerm ||
						typeFilter !== "ALL" ||
						statusFilter !== "ALL" ||
						date) && (
						<Button
							variant="ghost"
							size="icon"
							className="text-red-500 hover:text-red-700 hover:bg-red-50"
							onClick={clearFilters}
							title="Reset Filters"
						>
							<FilterX className="size-4" />
						</Button>
					)}
				</div>
			</div>

			{/* --- Data Table --- */}
			{/* Using the enhanced table from previous steps for full features */}
			<RecentTransactionTable records={filteredRecords} />
		</div>
	);
}
