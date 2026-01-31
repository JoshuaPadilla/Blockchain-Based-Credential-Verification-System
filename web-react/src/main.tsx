import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth_store";
import { useInsightsStore } from "./stores/insights_store";
import { useRecordStore } from "./stores/record_store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
		insights: undefined!,
		records: undefined!,
	},
});

const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	const auth = useAuthStore();
	const insights = useInsightsStore();
	const records = useRecordStore();

	// 2. Pass the live state into the context prop
	return (
		<RouterProvider router={router} context={{ auth, insights, records }} />
	);
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>,
	);
}
