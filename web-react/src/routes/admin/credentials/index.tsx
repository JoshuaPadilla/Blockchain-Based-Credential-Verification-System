import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { RecentTransactionTable } from "@/components/custom_components/recent_transaction_table";
import { DataTablePagination } from "@/components/custom_components/table_pagination";
import { TableSkeleton } from "@/components/custom_components/table_skeleton";
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
import {
	CredentialTypeEnum,
	type CredentialEnumType,
} from "@/enums/credential_type.enum"; // Adjust path as needed
import { cn } from "@/lib/utils";
import { useRecordStore } from "@/stores/record_store";
import type { RecordsQuery } from "@/types/record_query.type";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, FileDown, FilterX, Plus, Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useDebounce } from "use-debounce";

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
	const { getRecords } = useRecordStore();
	const navigate = useNavigate();
	// --- Filter States ---
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch] = useDebounce(searchTerm, 500);
	const [page, setPage] = useState(1);
	const limit = 5;

	const [typeFilter, setTypeFilter] = useState<CredentialEnumType | "All">(
		"All",
	);
	const [statusFilter, setStatusFilter] = useState<
		"All" | "ACTIVE" | "REVOKED"
	>("All");
	const [date, setDate] = useState<DateRange | undefined>(undefined);

	// --- Filtering Logic ---
	const { data: queryData, isPending } = useQuery({
		queryKey: [
			"adminRecords",
			debouncedSearch,
			typeFilter,
			statusFilter,
			date,
			page,
			limit,
		],
		queryFn: async () => {
			// 1. Build Payload strictly for Backend DTO
			const payload: RecordsQuery = {
				page,
				limit,
			};

			if (debouncedSearch) payload.search = debouncedSearch;
			if (typeFilter !== "All") payload.type = typeFilter;

			// Handle Boolean Logic
			if (statusFilter === "REVOKED") payload.revoked = true;
			if (statusFilter === "ACTIVE") payload.revoked = false;

			// Handle Date
			if (date?.from) {
				payload.date = {
					from: date.from,
					to: date.to || date.from, // Strict DTO requires 'to'
				};
			}

			// 2. Fetch
			const response = await getRecords(payload);

			// 3. Return safe object
			// Backend returns { records: [], total: 0 }
			return response || { records: [], total: 0 };
		},
	});

	const tableData = queryData?.records || [];
	const totalCount = queryData?.total || 0;

	// --- Handlers ---
	const clearFilters = () => {
		setSearchTerm("");
		setTypeFilter("All");
		setStatusFilter("All");
		setDate(undefined);
	};
	// Helper to handle Status Select conversion (String -> Boolean)

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
					<Button
						className="bg-[var(--button-primary)] hover:opacity-90 shadow-sm"
						onClick={() =>
							navigate({ to: "/admin/issue_credential" })
						}
					>
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
					<Select
						value={typeFilter}
						onValueChange={(val) => {
							// If value is "ALL", set to empty string, otherwise cast to Enum
							setTypeFilter(
								val === "All"
									? "All"
									: (val as CredentialEnumType),
							);
						}}
					>
						<SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
							<SelectValue placeholder="Credential Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Types</SelectItem>
							{Object.values(CredentialTypeEnum).map((type) => (
								<SelectItem
									key={type}
									value={type as CredentialEnumType}
								>
									{type.replace(/_/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Status Filter (Active/Revoked) */}
					<Select
						value={statusFilter}
						onValueChange={(val) => {
							setStatusFilter(
								val as "All" | "ACTIVE" | "REVOKED",
							);
						}}
					>
						<SelectTrigger className="w-[150px] bg-slate-50 border-slate-200">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Statuses</SelectItem>
							<SelectItem value="ACTIVE">Active Only</SelectItem>
							<SelectItem value="REVOKED">
								Revoked Only
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Reset Button (Only shows if filters are active) */}
					{(searchTerm || typeFilter || statusFilter || date) && (
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
			{isPending ? (
				<TableSkeleton />
			) : (
				<RecentTransactionTable records={tableData || []} />
			)}
			{/* --- Shared Pagination (Visible on both Desktop & Mobile) --- */}

			{/* Only show pagination if we have data */}
			{tableData.length > 0 && (
				<DataTablePagination
					currentPage={page}
					onPageChange={setPage}
					pageSize={limit}
					totalResults={totalCount}
					totalPages={Math.ceil(totalCount / limit)}
				/>
			)}
		</div>
	);
}
