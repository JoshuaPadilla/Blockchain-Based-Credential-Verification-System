import { AppBreadcrumb } from "@/components/custom_components/app_breadcrumb";
import { SignerHeader } from "@/components/custom_components/signer_header";
import { Role } from "@/enums/user_role.enum";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signer")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.auth.user || context.auth.user.role !== Role.SIGNER) {
			throw redirect({ to: "/login" });
		}
	},
});

function RouteComponent() {
	return (
		<>
			<SignerHeader />
			<div className="flex flex-1 flex-col gap-4">
				<div className="px-16 pt-4">
					<AppBreadcrumb />
				</div>
				<Outlet />
			</div>
		</>
	);
}
