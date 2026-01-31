import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/credentials")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-screen p-8 bg-slate-500">
			<div className="flex flex-1 p-4 bg-amber-100 h-full"></div>
		</div>
	);
}
