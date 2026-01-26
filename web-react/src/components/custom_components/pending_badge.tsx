import React from "react";
import { Badge } from "../ui/badge";
import { Loader } from "lucide-react";

export const PendingBadge = () => {
	return (
		<Badge
			variant="secondary"
			className="text-orange-800 font-mono border border-orange-400 bg-orange-200"
		>
			<Loader data-icon="inline-start" />
			Pending
		</Badge>
	);
};
