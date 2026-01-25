import { useAuthStore } from "@/stores/auth_store";
import { createFileRoute, redirect, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	beforeLoad: () => {
		const { user } = useAuthStore.getState();

		if (!user) {
			throw redirect({ to: "/login" });
		}
	},
});

function HomeComponent() {
	return <div className="w-full h-screen p-8 bg-slate-200"></div>;
}
