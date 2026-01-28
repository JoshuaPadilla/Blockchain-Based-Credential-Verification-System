import { Role } from "@/enums/user_role.enum";
import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
	component: HomeComponent,
	beforeLoad: ({ context }) => {
		if (!context.auth.user) {
			throw redirect({ to: "/login" });
		}

		if (context.auth.user?.role === Role.ADMIN) {
			throw redirect({ to: "/admin" });
		}

		// if (context.auth.user?.role === Role.SIGNER) {
		// 	throw redirect({ to: "/signer" });
		// }
	},
	loader: async ({ context }) => {
		await context.records.getRecords();
		await context.insights.getDashboardInsights();
	},
});

function HomeComponent() {
	return <div>Loading ...</div>;
}
