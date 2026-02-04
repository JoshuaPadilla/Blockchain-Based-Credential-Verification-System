import app_logo from "@/assets/img/app_logo.png";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, History, LayoutDashboard, ListTodo, Menu } from "lucide-react";
import { useState } from "react";
import { HeaderProfile } from "./header_profile";

const data = {
	navMain: [
		{
			label: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/signer/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			label: "Management",
			items: [
				{
					title: "Queue",
					url: "/signer/queue",
					icon: ListTodo,
				},
				{
					title: "History",
					url: "/signer/history",
					icon: History,
				},
			],
		},
	],
};

export const SignerHeader = () => {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	// Flatten for Desktop (keep strictly horizontal)
	const desktopNavItems = data.navMain.flatMap((group) => group.items);

	return (
		<header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all">
			{/* --- LEFT: Mobile Trigger & Logo --- */}
			<div className="flex items-center gap-4">
				{/* Mobile Hamburger Menu */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
						>
							<Menu className="size-5" />
							<span className="sr-only">
								Toggle navigation menu
							</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[85%] sm:w-[350px] pr-0"
					>
						<SheetHeader className="mb-8 px-4 text-left">
							<SheetTitle className="flex items-center gap-2.5">
								<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
									<img
										src={app_logo}
										className="size-6"
										alt="Logo"
									/>
								</div>
								<span className="font-heading font-bold text-xl tracking-tight">
									Cer<span className="text-primary">tus</span>
								</span>
							</SheetTitle>
						</SheetHeader>

						{/* Scrollable Mobile Nav Area */}
						<div className="flex flex-col gap-6 px-4">
							{data.navMain.map((group, index) => (
								<div
									key={index}
									className="flex flex-col gap-2"
								>
									{/* Section Label */}
									<h4 className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
										{group.label}
									</h4>
									<div className="flex flex-col gap-1">
										{group.items.map((item) => {
											const isActive =
												location.pathname === item.url;
											return (
												<Link
													key={item.url}
													to={item.url}
													onClick={() =>
														setIsOpen(false)
													}
													className={cn(
														"group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
														isActive
															? "bg-primary/10 text-primary"
															: "text-muted-foreground hover:bg-secondary hover:text-foreground",
													)}
												>
													<item.icon
														className={cn(
															"size-5 transition-colors",
															isActive
																? "text-primary"
																: "text-muted-foreground group-hover:text-foreground",
														)}
													/>
													{item.title}
													{isActive && (
														<div className="absolute right-0 h-full w-1 rounded-l-full bg-primary" />
													)}
												</Link>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</SheetContent>
				</Sheet>

				{/* Logo Area (Visible on Desktop/Mobile) */}
				<div className="relative z-10 flex items-center gap-2.5">
					<img
						src={app_logo}
						className="size-8 md:size-9 transition-transform hover:scale-105"
						alt="Logo"
					/>
					<span className="font-heading font-bold text-lg md:text-xl tracking-tight hidden xs:inline-block">
						Cer<span className="text-primary">tus</span>
					</span>
				</div>
			</div>

			{/* --- CENTER: Desktop Main Navigation --- */}
			<nav className="hidden md:flex h-full items-center gap-1">
				{desktopNavItems.map((item) => {
					const isActive = location.pathname === item.url;
					return (
						<Link
							key={item.url}
							to={item.url}
							className={cn(
								"group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50",
								isActive
									? "bg-secondary text-foreground font-semibold"
									: "text-muted-foreground",
							)}
						>
							{/* Optional: Show icon on desktop too, or remove if you want text only */}
							<item.icon
								className={cn(
									"size-4 transition-colors",
									isActive
										? "text-primary"
										: "text-muted-foreground group-hover:text-foreground",
								)}
							/>
							{item.title}
						</Link>
					);
				})}
			</nav>

			{/* --- RIGHT: Global Actions --- */}
			<div className="flex items-center gap-2 md:gap-3">
				<Button
					variant="ghost"
					size="icon"
					className="relative size-9 rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
				>
					<Bell className="size-5" />
					<span className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-background bg-destructive" />
				</Button>

				<div className="pl-1">
					<HeaderProfile />
				</div>
			</div>
		</header>
	);
};
