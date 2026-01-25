import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/students/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-screen p-8 bg-slate-500">Admin Dashboard</div>
	);
}
