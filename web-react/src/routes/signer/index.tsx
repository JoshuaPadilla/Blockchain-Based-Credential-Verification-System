import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth_store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/signer/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { logout } = useAuthStore();

	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();

			// Navigate immediately to login to prevent flashing protected content
			navigate({ to: "/login" });
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Log out error", error);
			toast.error("Failed to log out. Please try again.");
		}
	};
	return (
		<div>
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	);
}
