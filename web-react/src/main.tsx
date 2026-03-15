import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/space-grotesk/700.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Import the generated route tree
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth_store";
import { useBlockchainStore } from "./stores/blockchain_store";
import { useInsightsStore } from "./stores/insights_store";
import { useRecordStore } from "./stores/record_store";
import { useSignersStore } from "./stores/signer_store";
import { useUserStore } from "./stores/user_store";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
		insights: undefined!,
		records: undefined!,
		signer: undefined!,
		user: undefined!,
		blockchain: undefined!,
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
	const signer = useSignersStore();
	const user = useUserStore();
	const blockchain = useBlockchainStore();

	// 2. Pass the live state into the context prop
	return (
		<RouterProvider
			router={router}
			context={{ auth, insights, records, signer, user, blockchain }}
		/>
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

	// Fade out and remove the instant HTML loader once React has painted
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			const loader = document.getElementById("app-loader");
			if (loader) {
				loader.style.opacity = "0";
				loader.addEventListener(
					"transitionend",
					() => loader.remove(),
					{ once: true },
				);
			}
		});
	});
}
