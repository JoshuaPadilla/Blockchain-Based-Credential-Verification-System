import { PendingSkeleton } from "@/components/custom_components/pending_skeleton";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/students/")({
	component: RouteComponent,
	loader: async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
	},
	pendingMs: 0,
	pendingComponent: () => <PendingSkeleton />,
});

function RouteComponent() {
	return <div>Hello</div>;
}
