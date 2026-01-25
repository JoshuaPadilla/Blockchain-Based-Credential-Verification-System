import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
	component: PostsComponent,
	validateSearch: (search) => {
		return {
			q: (search.q as string) || "",
		};
	},
	loaderDeps: ({ search: q }) => ({ q }),
	loader: async ({ deps: { q } }) => {
		const posts = ["post1", "post2", "post3"];

		return {
			posts: posts.filter((p) => p === q.q),
		};
	},
});

function PostsComponent() {
	const { posts } = Route.useLoaderData();
	const { q } = Route.useSearch();

	return (
		<div>
			{posts.map((p) => (
				<div key={p}>
					<Link to="/posts/$postId" params={{ postId: p }}>
						{p}
					</Link>
				</div>
			))}
		</div>
	);
}
