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
import { useAuthStore } from "@/stores/auth_store";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	GraduationCap,
	LayoutDashboard,
	Newspaper,
	Paperclip,
	UserPen,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
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
					title: "Records",
					url: "/admin/credentials",
					icon: Newspaper,
				},
				{
					title: "Students",
					url: "/admin/students",
					icon: GraduationCap,
				},
				{
					title: "Authorized Signers",
					url: "/admin/signers",
					icon: UserPen,
				},
				{
					title: "Credential Types",
					url: "/admin/credential-types",
					icon: Paperclip,
				},
			],
		},
	],
};

export function AdminSidebar() {
	// 2. Get the controller from Shadcn
	const { setOpen } = useSidebar();
	const { logout, userProfile } = useAuthStore();
	const navigate = useNavigate();

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

	const handleLogout = async () => {
		try {
			await logout();
			navigate({ to: "/login" });
			toast.success("Logged out successfully");
		} catch {
			toast.error("Failed to log out. Please try again.");
		}
	};

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

			<SidebarFooter></SidebarFooter>
		</Sidebar>
	);
}
