import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
	beforeLoad: () => {
		// ✅ CORRECT: Only redirects if the user is exactly at "/admin/"
		throw redirect({ to: "/admin/dashboard" });
	},
});

function RouteComponent() {
	return <div>Hello "/admin/"!</div>;
}
