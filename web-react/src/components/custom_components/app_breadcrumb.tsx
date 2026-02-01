import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "@tanstack/react-router";
import { Home } from "lucide-react";
import React from "react";

// Helper to format "issue_credential" -> "Issue Credential"
const formatPathName = (path: string) => {
	return path
		.replace(/_/g, " ") // Replace underscores with spaces
		.replace(/-/g, " ") // Replace dashes with spaces
		.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of words
};

export const AppBreadcrumb = () => {
	const location = useLocation();

	// Split path and remove empty strings
	const pathNames = location.pathname.split("/").filter((path) => path);

	return (
		<Breadcrumb className="hidden md:flex">
			<BreadcrumbList>
				{/* Home Root */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							to="/"
							className="flex items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors"
						>
							<Home className="size-3.5 mb-0.5" />
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{pathNames.length > 0 && (
					<BreadcrumbSeparator className="text-slate-300" />
				)}

				{pathNames.map((link, index) => {
					// Reconstruct path
					const href = `/${pathNames.slice(0, index + 1).join("/")}`;
					const isLast = index === pathNames.length - 1;
					const formattedName = formatPathName(link);

					return (
						<React.Fragment key={link}>
							<BreadcrumbItem>
								{isLast ? (
									<span className="font-semibold text-slate-900">
										{formattedName}
									</span>
								) : (
									<BreadcrumbLink asChild>
										<Link
											to={href}
											className="text-slate-500 hover:text-slate-900 transition-colors"
										>
											{formattedName}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>

							{!isLast && (
								<BreadcrumbSeparator className="text-slate-300" />
							)}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
