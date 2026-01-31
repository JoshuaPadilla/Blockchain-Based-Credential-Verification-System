import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShieldCheck } from "lucide-react";

export const SideBarHeaderCustom = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					{/* 1. The Logo/Icon (Always Visible) */}
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
						<ShieldCheck className="size-5" />
					</div>

					{/* 2. The Text (Automatically hidden when collapsed) */}
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-bold font-heading text-lg">
							CredentialChain
						</span>
						<span className="truncate text-xs font-semibold font-mono">
							Admin
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
