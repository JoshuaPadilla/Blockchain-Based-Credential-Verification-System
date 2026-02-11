import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useBlockchainStore } from "@/stores/blockchain_store";
import { Bell, Menu, Wifi } from "lucide-react";
import { AppBreadcrumb } from "./app_breadcrumb";
import { HeaderProfile } from "./header_profile";

export const AdminHeader = () => {
	// Assuming you are using Shadcn sidebar context
	const { toggleSidebar } = useSidebar();
	const { blockchainDetails } = useBlockchainStore();

	console.log(blockchainDetails);

	return (
		<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-all">
			{/* --- LEFT: Navigation Context --- */}
			<div className="flex items-center gap-4">
				{/* Mobile/Tablet Sidebar Toggle */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden -ml-2 text-slate-500"
					onClick={toggleSidebar}
				>
					<Menu className="size-5" />
				</Button>

				{/* Vertical Divider (Hidden on mobile) */}
				<div className="h-4 w-px bg-slate-200 hidden md:block" />

				{/* Breadcrumbs */}
				<AppBreadcrumb />
			</div>

			{/* --- RIGHT: Global Actions & Status --- */}
			<div className="flex items-center gap-3 md:gap-4">
				{/* 2. Network Status Indicator (Replaces Gas) */}
				{/* Critical for Blockchain Admins to know if they are on Testnet vs Mainnet */}
				<div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
					<div className="relative flex items-center justify-center size-2.5">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
					</div>
					<span className="text-xs font-semibold text-slate-700">
						{(
							blockchainDetails?.networkName.at(0) || ""
						).toUpperCase()}
						{blockchainDetails?.networkName.slice(1)}{" "}
						<span className="text-slate-400 font-normal">
							Testnet
						</span>
					</span>
					<div className="h-3 w-px bg-slate-200 mx-1" />
					<Wifi className="size-3 text-green-500" />
				</div>

				{/* 3. Notification Bell */}
				<Button
					variant="ghost"
					size="icon"
					className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full size-9"
				>
					<Bell className="size-5" />
					{/* Unread Indicator */}
					<span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-red-500 border-2 border-white transform translate-x-1/2 -translate-y-1/2" />
				</Button>

				{/* 4. Profile */}
				<div className="pl-1">
					<HeaderProfile />
				</div>
			</div>
		</header>
	);
};
