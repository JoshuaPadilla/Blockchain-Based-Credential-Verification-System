import { useLocation, Link } from "@tanstack/react-router";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";

export const AppBreadcrumb = () => {
	const location = useLocation();

	// 1. Split path and remove empty strings (fixes the empty first item)
	const pathNames = location.pathname.split("/").filter((path) => path);

	return (
		// 2. Added z-50 to ensure it sits on top of other elements
		<Breadcrumb>
			<BreadcrumbList>
				{/* Always show a Home link first */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{pathNames.length > 0 && <BreadcrumbSeparator />}

				{pathNames.map((link, index) => {
					// 3. Reconstruct the full path for this segment
					const href = `/${pathNames.slice(0, index + 1).join("/")}`;
					const isLast = index === pathNames.length - 1;

					return (
						<React.Fragment key={link}>
							<BreadcrumbItem>
								{isLast ? (
									// If it's the last item, just show text (no link)
									<span className="font-semibold">
										{link}
									</span>
								) : (
									<BreadcrumbLink asChild>
										<Link to={href}>{link}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{/* Add separator unless it's the last item */}
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
