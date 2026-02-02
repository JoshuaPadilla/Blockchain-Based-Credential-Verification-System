import { AdminSidebar } from "@/components/admin_sidebar";
import { AdminHeader } from "@/components/custom_components/admin_header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Role } from "@/enums/user_role.enum";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
	beforeLoad: ({ context }) => {
		// Only checks authentication.
		// ❌ REMOVED: throw redirect({ to: "/admin/dashboard" });
		if (!context.auth.user || context.auth.user.role !== Role.ADMIN) {
			throw redirect({ to: "/login" });
		}
	},
});

function AdminLayout() {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<AdminHeader />
				<div className="flex flex-1 flex-col gap-4">
					{/* This Outlet renders child routes like /admin/dashboard */}
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
