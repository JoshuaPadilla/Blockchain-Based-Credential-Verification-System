import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar, // 1. Import the hook
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import {
	ChevronUp,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Newspaper,
	Settings,
	User,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { SideBarHeaderCustom } from "./custom_components/side_bar_header";

const data = {
	navMain: [
		{
			label: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/admin/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			label: "Management",
			items: [
				{
					title: "Credentials",
					url: "/admin/credentials",
					icon: Newspaper,
				},
				{
					title: "Students",
					url: "/admin/students",
					icon: GraduationCap,
				},
			],
		},
	],
};

export function AdminSidebar() {
	// 2. Get the controller from Shadcn
	const { setOpen } = useSidebar();

	// 3. Get current URL from TanStack Router
	const { pathname } = useLocation();

	// 4. Flatten the menu data to get a simple list of valid URLs
	const validUrls = useMemo(() => {
		return data.navMain.flatMap((group) =>
			group.items.map((item) => item.url),
		);
	}, []);

	// 5. The Logic: Check route on change
	useEffect(() => {
		// Check if the current page starts with any of our sidebar links
		const isSidebarPage = validUrls.some((url) => pathname.startsWith(url));

		if (isSidebarPage) {
			setOpen(true); // Open sidebar on main pages (Dashboard, Students, etc.)
		} else {
			setOpen(false); // Close sidebar on "Focus" pages (Success, Details, etc.)
		}
	}, [pathname, validUrls, setOpen]);

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SideBarHeaderCustom />
			</SidebarHeader>

			<SidebarSeparator className="mx-2" />

			<SidebarContent>
				{data.navMain.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
										>
											<Link
												to={item.url}
												activeProps={{
													className:
														"bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
												}}
												className="transition-all duration-200 ease-in-out"
											>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
										<User className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											Admin User
										</span>
										<span className="truncate text-xs">
											admin@school.edu
										</span>
									</div>
									<ChevronUp className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem>
									<Settings className="mr-2 size-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500 focus:text-red-500">
									<LogOut className="mr-2 size-4" />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
