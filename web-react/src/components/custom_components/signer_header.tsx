import app_logo from "@/assets/img/app_logo.png";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { HeaderProfile } from "./header_profile";

const data = {
	navMain: [
		{
			label: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/signer/dashboard",
				},
			],
		},
		{
			label: "Management",
			items: [
				{
					title: "Credentials",
					url: "/signer/queue",
				},
				{
					title: "Students",
					url: "/signer/history",
				},
			],
		},
	],
};

export const SignerHeader = () => {
	const location = useLocation();

	// 1. Flatten the nested data structure for a horizontal menu
	const navItems = data.navMain.flatMap((group) => group.items);

	return (
		<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md transition-all">
			{/* --- LEFT: Navigation Context --- */}
			<div className="flex items-center gap-4">
				{/* Logo Area */}
				<div className="relative z-10 flex items-center gap-3">
					<img src={app_logo} className="size-10" />

					<span className="font-heading font-bold text-xl tracking-tight">
						Cer
						<span className="text-[var(--button-primary)]">
							tus
						</span>
					</span>
				</div>
			</div>

			{/* --- CENTER: Main Navigation --- */}
			{/* Replaced the yellow div with this Nav */}
			<nav className="hidden md:flex h-full items-center gap-6">
				{navItems.map((item) => {
					// Check if current path starts with the item url (handles sub-pages)
					// or use strict equality depending on your preference.
					const isActive = location.pathname === item.url;

					return (
						<Link
							key={item.url}
							to={item.url}
							className={`
                relative flex h-full items-center text-sm font-medium transition-colors
                ${
					isActive
						? "text-foreground font-semibold"
						: "text-muted-foreground hover:text-foreground"
				}
              `}
						>
							{item.title}
							{/* Active Underline Indicator */}
							{isActive && (
								<span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
							)}
						</Link>
					);
				})}
			</nav>

			{/* --- RIGHT: Global Actions & Status --- */}
			<div className="flex items-center gap-3 md:gap-4">
				{/* Notification Bell */}
				<Button
					variant="ghost"
					size="icon"
					className="relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-9"
				>
					<Bell className="size-5" />
					{/* Unread Indicator */}
					<span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-destructive border-2 border-background transform translate-x-1/2 -translate-y-1/2" />
				</Button>

				{/* Profile */}
				<div className="pl-1">
					<HeaderProfile />
				</div>
			</div>
		</header>
	);
};
