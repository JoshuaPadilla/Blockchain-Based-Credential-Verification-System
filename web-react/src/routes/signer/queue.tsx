import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signer/queue")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/signer/queue"!</div>;
}
