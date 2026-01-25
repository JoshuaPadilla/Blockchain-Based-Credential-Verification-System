import { createFileRoute } from "@tanstack/react-router";
import { resolve } from "path";

export const Route = createFileRoute("/posts/$postId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		throw new Error();
		await new Promise((resolve) => setTimeout(resolve));
		return { postId: params.postId };
	},
	pendingComponent: () => <div>loading...</div>,
	errorComponent: () => <div>Error</div>,
	pendingMs: 500,
});

function RouteComponent() {
	const { postId } = Route.useLoaderData();
	return <div>Hello {postId}</div>;
}
