import {
	LayoutDashboard,
	GraduationCap,
	Newspaper,
	Settings,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBarHeaderCustom } from "./custom_components/side_bar_header";
import { Link, useLocation } from "@tanstack/react-router";

// Menu items.
const items = [
	{
		title: "Dashboard",
		url: "/admin/dashboard",
		icon: LayoutDashboard,
	},
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
];

export function AdminSidebar() {
	return (
		<Sidebar>
			{/* header */}
			<SidebarHeader>
				<SideBarHeaderCustom />
			</SidebarHeader>

			{/* content */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="">
						<SidebarMenu className="p-1">
							{items.map((item) => {
								return (
									<SidebarMenuItem key={item.title}>
										{/* 4. Pass isActive to Shadcn Button */}
										<SidebarMenuButton
											asChild
											tooltip={item.title}
										>
											<Link
												to={item.url}
												activeProps={{
													className:
														"bg-sidebar-accent text-sidebar-accent-foreground font-semibold m-2",
												}}
											>
												<item.icon className="size-6!" />
												<span className="text-lg font-mono ">
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
