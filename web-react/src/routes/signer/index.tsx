import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signer/")({
	component: RouteComponent,
	beforeLoad: () => {
		// ✅ CORRECT: Only redirects if the user is exactly at "/signer/"
		throw redirect({ to: "/signer/dashboard" });
	},
});

function RouteComponent() {
	return null;
}
