import { CreateSignerDialog } from "@/components/custom_components/add_signer_modal";
import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user_store";
import type { UserProfile } from "@/types/user_profile.type";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

// --- Helper for consistent avatar colors ---
const getAvatarColor = (name: string) => {
	const colors = [
		"bg-red-100 text-red-600",
		"bg-blue-100 text-blue-600",
		"bg-green-100 text-green-600",
		"bg-yellow-100 text-yellow-600",
		"bg-purple-100 text-purple-600",
		"bg-pink-100 text-pink-600",
	];
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
};

export const Route = createFileRoute("/admin/signers/")({
	component: RouteComponent,
	// Note: standard preloading usually requires the same query params to match hydration
	pendingComponent: () => <PendingSkeleton />,
	pendingMs: 0,
});

function RouteComponent() {
	const { getSigners } = useUserStore();

	const [addSignerOpen, setAddSignerOpen] = useState(false);

	// --- State Management ---
	const [queryTerm, setQueryTerm] = useState("");
	const [debouncedSearch] = useDebounce(queryTerm, 500);

	// Filter States
	const [roleFilter, setRoleFilter] = useState<string | undefined>();
	const [positionFilter, setPositionFilter] = useState<string | undefined>();
	const [statusFilter, setStatusFilter] = useState<string | undefined>();

	// --- Query ---
	const { data, isPending } = useQuery({
		// FIX 1: Add dependencies to queryKey so it refetches on change
		queryKey: [
			"signers",
			debouncedSearch,
			roleFilter,
			positionFilter,
			statusFilter,
		],
		queryFn: async () => {
			// Pass all filters to your store function
			const signers = await getSigners(
				"signer",
				debouncedSearch,
				// Add other filters here if your API supports them:
				// roleFilter,
				// positionFilter
			);
			return signers;
		},
	});

	return (
		<>
			<div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
				{/* --- Header Section --- */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							Signer Directory
						</h1>
						<div className="flex items-center gap-2 mt-2">
							<span className="h-2 w-2 rounded-full bg-green-500" />
							<p className="text-sm text-gray-500">
								{data?.length || 0} signers found
							</p>
						</div>
					</div>
					<CreateSignerDialog
						isOpen={addSignerOpen}
						setOpen={setAddSignerOpen}
					/>
				</div>

				{/* --- Filters & Search Section --- */}
				<div className="space-y-4 bg-white p-4 rounded-xl border shadow-sm">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search Bar */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by name, ID, or wallet address..."
								className="pl-10 bg-gray-50 border-gray-200"
								value={queryTerm}
								onChange={(e) => setQueryTerm(e.target.value)}
							/>
						</div>

						{/* Filter Dropdowns */}
						<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
							<Select onValueChange={setPositionFilter}>
								<SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
									<SelectValue placeholder="Position" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="head">Head</SelectItem>
									<SelectItem value="legal">Legal</SelectItem>
								</SelectContent>
							</Select>

							<Select onValueChange={setRoleFilter}>
								<SelectTrigger className="w-[130px] bg-gray-50 border-gray-200">
									<SelectValue placeholder="Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="user">User</SelectItem>
								</SelectContent>
							</Select>

							<Select onValueChange={setStatusFilter}>
								<SelectTrigger className="w-[130px] bg-gray-50 border-gray-200">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="verified">
										Verified
									</SelectItem>
									<SelectItem value="pending">
										Pending
									</SelectItem>
								</SelectContent>
							</Select>

							{/* Clear Filters Button */}
							{(roleFilter ||
								positionFilter ||
								statusFilter ||
								queryTerm) && (
								<Button
									variant="ghost"
									size="icon"
									className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
									onClick={() => {
										setRoleFilter(undefined);
										setPositionFilter(undefined);
										setStatusFilter(undefined);
										setQueryTerm("");
									}}
								>
									<Filter className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* --- Grid Layout --- */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{isPending
						? // Render multiple skeletons for grid effect
							Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="h-[300px] w-full bg-gray-200 animate-pulse rounded-xl"
								/>
							))
						: data?.map((signer, index) => (
								<SignerCard key={index} signer={signer} />
							))}
				</div>
			</div>
		</>
	);
}

// --- Card Component ---
function SignerCard({ signer }: { signer: UserProfile }) {
	const colorClass = getAvatarColor(signer.firstName);
	// FIX 2: Safe Access for middleName
	const middleInitial = signer.middleName ? `${signer.middleName[0]}.` : "";

	return (
		<Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
			{/* Top Graphic Area */}
			<div
				className={`h-32 w-full relative ${colorClass} opacity-20`}
			></div>

			{/* Content wrapper relative to allow overlap */}
			<div className="relative px-6">
				{/* Avatar */}
				<div className="-mt-10 mb-4 flex justify-center">
					<div
						className={`h-20 w-20 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold shadow-sm bg-gray-800 text-white`}
					>
						{signer.firstName[0]}
						{signer.lastName[0]}
					</div>
				</div>

				<CardContent className="p-0 text-center pb-6">
					<h3 className="text-lg font-bold text-gray-900 truncate">
						{signer.firstName} {middleInitial} {signer.lastName}
					</h3>
					<p className="text-xs text-gray-400 uppercase tracking-wider font-mono mt-1 mb-3 truncate">
						{signer.email}
					</p>

					<div className="flex items-center justify-center gap-2 text-sm text-gray-600">
						<span className="font-medium text-blue-600">
							{signer.signerPosition?.toUpperCase() || "SIGNER"}
						</span>
					</div>
					<p className="text-xs text-gray-400 mt-1">
						{signer.role.toUpperCase()}
					</p>
				</CardContent>
			</div>

			<CardFooter className="px-4 pb-4 bg-gray-50/50 pt-4 border-t border-gray-100">
				<Button
					variant="outline"
					className="w-full border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
				>
					View Profile
				</Button>
			</CardFooter>
		</Card>
	);
}
