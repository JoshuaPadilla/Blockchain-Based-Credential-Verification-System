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

export const HeaderProfile = () => {
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
					Profile
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
				<DropdownMenuItem variant="destructive">
					<LogOutIcon />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
