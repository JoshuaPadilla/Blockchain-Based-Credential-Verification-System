import app_logo from "@/assets/img/app_logo.png";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export const SideBarHeaderCustom = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					{/* 1. The Logo/Icon (Always Visible) */}
					<div className="relative z-10 flex items-center gap-3">
						<img src={app_logo} className="size-8" />

						<span className="font-heading font-bold text-xl tracking-tight">
							Cer
							<span className="text-button-primary">tus</span>
						</span>
					</div>

					{/* 2. The Text (Automatically hidden when collapsed) */}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
