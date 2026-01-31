import { Bell } from "lucide-react";
import { AppBreadcrumb } from "./app_breadcrumb";
import { HeaderProfile } from "./header_profile";

export const AdminHeader = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-start">
			{/* Vertical Separator */}
			<AppBreadcrumb />

			<div className="flex items-center gap-2 ml-auto">
				<p>Current Gas here</p>
				|
				<Bell />
				<HeaderProfile />
			</div>
		</header>
	);
};
