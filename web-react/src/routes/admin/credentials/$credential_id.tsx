import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/credentials/$credential_id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/credentials/$credential"!</div>;
}
