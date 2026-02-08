import { CreateCredentialTypeDialog } from "@/components/custom_components/add_credential_type_dialog";
import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
} from "@/enums/credential_type.enum";
import { useCredentialTypeStore } from "@/stores/credential_type_store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	FileText,
	Filter,
	GraduationCap,
	MoreHorizontal,
	Scroll,
	Search,
	SearchX,
	ShieldCheck, // Added for empty state
	X,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/admin/credential-types/")({
	component: RouteComponent,
	pendingComponent: () => <PendingSkeleton />,
});

function RouteComponent() {
	const { fetchCredentialTypes } = useCredentialTypeStore();

	// --- State for Filters ---
	const [queryTerm, setQueryTerm] = useState("");
	const [debouncedSearch] = useDebounce(queryTerm, 500);
	const [typeFilter, setTypeFilter] = useState<string>("ALL");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// --- Data Fetching ---
	const { data: credentialTypes = [], isPending } = useQuery({
		queryKey: ["credential_types", debouncedSearch, typeFilter],
		queryFn: async () => {
			return await fetchCredentialTypes(
				typeFilter === "ALL" ? "" : (typeFilter as CredentialEnumType),
			);
		},
	});

	// Helper to get icon based on type
	const getTypeIcon = (type: CredentialEnumType) => {
		switch (type) {
			case CredentialTypeEnum.DIPLOMA:
				return <GraduationCap className="h-6 w-6 text-blue-600" />;
			case CredentialTypeEnum.TOR:
				return <FileText className="h-6 w-6 text-orange-600" />;
			default:
				return <Scroll className="h-6 w-6 text-gray-600" />;
		}
	};

	const clearFilters = () => {
		setQueryTerm("");
		setTypeFilter("ALL");
	};

	return (
		<div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* --- Header Section --- */}
				<div className="flex flex-col gap-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-1">
							<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
								Credential Standards
							</h1>
							<p className="text-sm text-gray-500 max-w-2xl">
								Configure required signatures, quorums, and
								workflows for each university document type.
							</p>
						</div>
						<div className="w-full sm:w-auto">
							<CreateCredentialTypeDialog
								isOpen={isDialogOpen}
								setOpen={setIsDialogOpen}
							/>
						</div>
					</div>

					{/* --- Filters Toolbar --- */}
					<div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
						<div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-1">
							{/* Search Input */}
							<div className="relative w-full sm:w-[320px]">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search types..."
									className="pl-10 bg-gray-50 border-gray-200 w-full"
									value={queryTerm}
									onChange={(e) =>
										setQueryTerm(e.target.value)
									}
								/>
							</div>

							{/* Type Filter */}
							<div className="flex gap-2 w-full sm:w-auto">
								<Select
									value={typeFilter}
									onValueChange={setTypeFilter}
								>
									<SelectTrigger className="w-full sm:w-[200px] bg-gray-50 border-gray-200">
										<div className="flex items-center gap-2 truncate">
											<Filter className="h-4 w-4 text-gray-500 shrink-0" />
											<SelectValue placeholder="Filter by Type" />
										</div>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ALL">
											All Types
										</SelectItem>
										{Object.values(CredentialTypeEnum).map(
											(type) => (
												<SelectItem
													key={type}
													value={type}
												>
													{type.replace(/_/g, " ")}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>

								{/* Clear Filters Button */}
								{(queryTerm || typeFilter !== "ALL") && (
									<Button
										variant="ghost"
										size="icon"
										onClick={clearFilters}
										className="text-gray-500 hover:text-red-600 hover:bg-red-50 shrink-0"
										title="Clear filters"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>

						<div className="text-xs text-gray-500 font-medium whitespace-nowrap hidden md:block">
							Showing {credentialTypes.length} results
						</div>
					</div>
				</div>

				{/* --- Content Grid --- */}
				{isPending ? (
					<PendingSkeleton />
				) : credentialTypes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
						<div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<SearchX className="h-6 w-6 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900">
							No types found
						</h3>
						<p className="text-sm text-gray-500 max-w-sm mt-1 mb-4">
							We couldn't find any credential standards matching
							your search filters.
						</p>
						<Button
							variant="outline"
							onClick={clearFilters}
							className="border-blue-200 text-blue-600 hover:bg-blue-50"
						>
							Clear Filters
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
						{credentialTypes.map((config: any) => (
							<Card
								key={config.id}
								className="border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group flex flex-col"
							>
								{/* Decoration Line */}
								<div
									className={`h-1.5 w-full absolute top-0 left-0 transition-colors ${
										config.name ===
										CredentialTypeEnum.DIPLOMA
											? "bg-blue-600"
											: "bg-orange-500"
									}`}
								/>

								<CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
									<div className="flex items-start gap-3">
										<div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors shrink-0">
											{getTypeIcon(config.name)}
										</div>
										<div className="space-y-1">
											<CardTitle className="text-base font-bold text-gray-900 leading-tight">
												{config.name.replace(/_/g, " ")}
											</CardTitle>
											<CardDescription className="text-xs font-mono text-gray-400">
												Updated{" "}
												{new Date(
													config.updatedAt,
												).toLocaleDateString()}
											</CardDescription>
										</div>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-700"
											>
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">
													Open menu
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-[160px]"
										>
											<DropdownMenuItem className="cursor-pointer">
												Edit Configuration
											</DropdownMenuItem>
											<DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</CardHeader>

								<CardContent className="space-y-6 pt-4 flex-1">
									{/* Stats Row */}
									<div className="flex items-center justify-between text-sm bg-gray-50/50 p-2 rounded-lg border border-gray-100">
										<div className="flex items-center gap-2 text-gray-600">
											<ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
											<span className="font-medium">
												Quorum:
											</span>
										</div>
										<Badge
											variant="secondary"
											className="font-mono text-xs px-2.5 bg-white border border-gray-200 shadow-sm"
										>
											{config.requiredSignaturesCount} /{" "}
											{config.signers?.length || 0}
										</Badge>
									</div>

									{/* Signers List */}
									<div>
										<div className="flex items-center justify-between mb-3">
											<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
												Authorized Signers
											</p>
										</div>

										<div className="flex items-center -space-x-2 overflow-hidden pl-1 py-1">
											{config.signers
												?.slice(0, 5)
												.map((signer: any) => (
													<Avatar
														key={signer.id}
														className="border-2 border-white h-9 w-9 ring-1 ring-gray-100 hover:ring-blue-200 hover:z-10 transition-all cursor-help"
													>
														<AvatarImage
															src={`https://api.dicebear.com/7.x/initials/svg?seed=${signer.firstName}`}
															alt={
																signer.firstName
															}
														/>
														<AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold">
															{
																signer
																	.firstName?.[0]
															}
															{
																signer
																	.lastName?.[0]
															}
														</AvatarFallback>
													</Avatar>
												))}

											{config.signers &&
												config.signers.length > 5 && (
													<div className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-white bg-gray-50 text-[10px] font-medium text-gray-500 ring-1 ring-gray-100">
														+
														{config.signers.length -
															5}
													</div>
												)}

											{(!config.signers ||
												config.signers.length ===
													0) && (
												<span className="text-xs text-gray-400 italic pl-1">
													No signers assigned
												</span>
											)}
										</div>
									</div>
								</CardContent>

								<CardFooter className="bg-gray-50/80 border-t px-6 py-3 mt-auto">
									<p className="text-[10px] text-gray-400 w-full text-center flex justify-center gap-1">
										<span>ID:</span>
										<span className="font-mono text-gray-500 truncate max-w-[150px]">
											{config.id}
										</span>
									</p>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
