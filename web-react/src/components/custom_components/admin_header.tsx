import React from "react";
import { AppBreadcrumb } from "./app_breadcrumb";
import { HeaderProfile } from "./header_profile";
import { Bell } from "lucide-react";

export const AdminHeader = ({ children }: { children: React.ReactNode }) => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
			{/* Vertical Separator */}
			{children}
			<AppBreadcrumb />

			<div className="flex items-center gap-2">
				<p>Current Gas here</p>
				|
				<Bell />
				<HeaderProfile />
			</div>
		</header>
	);
};
