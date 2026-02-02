import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/signer")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
