import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/credentials")({
	component: RouteComponent,
});

function RouteComponent() {
	<div className="w-full h-screen p-8 bg-slate-500">Admin Dashboard</div>;
}
