import {
	LayoutDashboard,
	GraduationCap,
	Newspaper,
	Settings,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Credentials",
		url: "/credentials",
		icon: Newspaper,
	},
	{
		title: "Students",
		url: "/students",
		icon: GraduationCap,
	},
];

export function AppSidebar() {
	const location = useLocation();
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
