import { useAuthStore } from "@/stores/auth_store";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner"; // Optional: Use for better user feedback
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const HeaderProfile = () => {
	// 1. Get Authentication State & Actions
	const { userProfile, logout } = useAuthStore();
	const navigate = useNavigate();

	// 2. Helper to extract initials (e.g., "John Doe" -> "JD")
	const getInitials = () => {
		if (!userProfile?.firstName) return "U";
		return `${userProfile.firstName.charAt(0)}${userProfile.lastName?.charAt(0) || ""}`.toUpperCase();
	};

	// 3. Logout Logic
	const handleLogout = async () => {
		try {
			await logout();

			// Navigate immediately to login to prevent flashing protected content
			navigate({ to: "/login" });
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Log out error", error);
			toast.error("Failed to log out. Please try again.");
		}
	};

	return (
		<DropdownMenu>
			{/* TRIGGER: The clickable button in the header */}
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-auto gap-2 px-2 hover:bg-accent focus-visible:ring-0"
				>
					<Avatar className="h-8 w-8 border border-border">
						<AvatarImage
							src="https://github.com/shadcn.png" // Replace with userProfile.avatarUrl if available
							alt={userProfile?.firstName}
							className="grayscale" // Style choice: keep it subtle
						/>
						<AvatarFallback>{getInitials()}</AvatarFallback>
					</Avatar>

					{/* Hide name on mobile to save space, show on tablet+ */}
					<div className="hidden flex-col items-start text-sm md:flex">
						<span className="font-semibold">
							{userProfile?.firstName || "User"}
						</span>
					</div>

					<ChevronDown className="ml-1 h-4 w-4 text-muted-foreground opacity-50" />
				</Button>
			</DropdownMenuTrigger>

			{/* CONTENT: The actual menu */}
			<DropdownMenuContent className="w-56" align="end" forceMount>
				{/* Header Section: Shows full user details */}
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{userProfile?.firstName} {userProfile?.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{userProfile?.role || "user@example.com"}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Grouping items is good for accessibility */}
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Destructive Action */}
				<DropdownMenuItem
					className="text-red-600 focus:text-red-600 cursor-pointer"
					onClick={handleLogout}
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
