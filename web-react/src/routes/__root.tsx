import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/auth_store";
import type { useBlockchainStore } from "@/stores/blockchain_store";
import type { useInsightsStore } from "@/stores/insights_store";
import type { useRecordStore } from "@/stores/record_store";
import type { useSignersStore } from "@/stores/signer_store";
import type { useUserStore } from "@/stores/user_store";
import {
	createRootRouteWithContext,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRouterContext {
	auth: ReturnType<typeof useAuthStore.getState>;
	insights: ReturnType<typeof useInsightsStore.getState>;
	records: ReturnType<typeof useRecordStore.getState>;
	signer: ReturnType<typeof useSignersStore.getState>;
	user: ReturnType<typeof useUserStore.getState>;
	blockchain: ReturnType<typeof useBlockchainStore.getState>;
}

const RootLayout = () => {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	return (
		<>
			{/* Global navigation progress bar */}
			<div
				className={`fixed top-0 left-0 right-0 z-9999 h-0.5 bg-blue-500 transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				style={
					isLoading
						? {
								animation:
									"nav-progress 1.5s ease-in-out infinite",
							}
						: undefined
				}
			/>
			<Outlet />
			<Toaster richColors position="top-right" />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		// Only check auth if we don't have a user yet
		await context.blockchain.getBlockchainDetails();

		if (!context.auth.user) {
			await context.auth.checkAuth();
		}
	},
	component: RootLayout,
});
