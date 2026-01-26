import { AppSidebar } from "@/components/app_sidebar";
import { AppBreadcrumb } from "@/components/custom_components/app_breadcrumb";
import { Header } from "@/components/custom_components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth_store";
import {
	createRootRouteWithContext,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRouterContext {
	auth: ReturnType<typeof useAuthStore.getState>;
}

const RootLayout = () => {
	const { user, checkAuth } = useAuthStore();

	return (
		<SidebarProvider>
			{user && <AppSidebar />}

			{/* 2. WRAP content in SidebarInset. This pushes content to the right of the sidebar. */}
			<SidebarInset className="bg-accent">
				{/* 3. Create a sticky header for Trigger + Breadcrumb */}
				{user && <Header />}

				{/* 4. The main page content goes here */}
				<div className="flex flex-1 flex-col gap-4">
					<Outlet />
				</div>
			</SidebarInset>
			<TanStackRouterDevtools />
		</SidebarProvider>
	);
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		// Only check auth if we don't have a user yet
		if (!context.auth.user) {
			await context.auth.checkAuth();
		}
	},
	component: RootLayout,
});
