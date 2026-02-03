import { AppBreadcrumb } from "@/components/custom_components/app_breadcrumb";
import { SignerHeader } from "@/components/custom_components/signer_header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Role } from "@/enums/user_role.enum";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signer")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		// Only checks authentication.
		if (!context.auth.user || context.auth.user.role !== Role.SIGNER) {
			throw redirect({ to: "/login" });
		}
	},
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<SidebarInset>
				<SignerHeader />
				<div className="flex flex-1 flex-col gap-4">
					{/* This Outlet renders child routes like /admin/dashboard */}

					<div className="px-16 pt-4">
						<AppBreadcrumb />
					</div>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
