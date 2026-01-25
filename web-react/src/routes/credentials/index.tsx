import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/credentials/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="w-full h-screen p-8 bg-slate-300"></div>;
}
