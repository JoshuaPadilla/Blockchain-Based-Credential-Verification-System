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
		.replace(/_/g, " ")
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Define paths you want to hide
const HIDDEN_SEGMENTS = ["admin", "signer"];

export const AppBreadcrumb = () => {
	const location = useLocation();

	// 1. Get raw segments
	const rawSegments = location.pathname.split("/").filter((path) => path);

	// 2. Generate the data with correct HREF first, THEN filter
	const breadcrumbItems = rawSegments
		.map((segment, index) => {
			// Create the href using the full path history (including hidden ones)
			const href = `/${rawSegments.slice(0, index + 1).join("/")}`;

			return {
				segment,
				formattedName: formatPathName(segment),
				href,
				isVisible: !HIDDEN_SEGMENTS.includes(segment),
			};
		})
		// 3. Filter out the items we don't want to see
		.filter((item) => item.isVisible);

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

				{breadcrumbItems.length > 0 && (
					<BreadcrumbSeparator className="text-slate-300" />
				)}

				{breadcrumbItems.map((item, index) => {
					const isLast = index === breadcrumbItems.length - 1;

					return (
						<React.Fragment key={item.href}>
							<BreadcrumbItem>
								{isLast ? (
									<span className="font-semibold text-button-primary">
										{item.formattedName}
									</span>
								) : (
									<BreadcrumbLink asChild>
										<Link
											to={item.href}
											className="text-slate-500 hover:text-slate-900 transition-colors"
										>
											{item.formattedName}
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
