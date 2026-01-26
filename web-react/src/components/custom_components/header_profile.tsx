import React from "react";
import { Button } from "../ui/button";
import { ChevronDown, LogOutIcon, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useAuthStore } from "@/stores/auth_store";
import { Navigate, useNavigate } from "@tanstack/react-router";

export const HeaderProfile = () => {
	const { userProfile, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate({ to: "/login" });
		} catch (error) {
			console.log("Log out error");
		}
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="gap-4">
				<Button variant="ghost" size="sm">
					<Avatar>
						<AvatarImage
							src="https://github.com/shadcn.png"
							alt="@shadcn"
							className="grayscale"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					{userProfile?.firstName}
					<ChevronDown data-icon="inline-end" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="bg-sidebar-accent">
				<DropdownMenuItem>
					<User />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={handleLogout}>
					<LogOutIcon />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
