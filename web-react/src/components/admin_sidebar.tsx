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
								const isActive =
									item.url === "/"
										? location.pathname === "/"
										: location.pathname.startsWith(
												item.url,
											);
								return (
									<SidebarMenuItem key={item.title}>
										{/* 4. Pass isActive to Shadcn Button */}
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
										>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
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
