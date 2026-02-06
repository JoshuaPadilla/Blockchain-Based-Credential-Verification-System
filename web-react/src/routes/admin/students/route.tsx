import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/students")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet></Outlet>;
}
