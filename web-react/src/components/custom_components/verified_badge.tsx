import React from "react";
import { Badge } from "../ui/badge";
import { BadgeCheck, Loader } from "lucide-react";

export const VerifiedBadge = () => {
	return (
		<Badge
			variant="default"
			className="text-green-800 font-mono border border-green-400 bg-green-200"
		>
			<BadgeCheck data-icon="inline-start" />
			Verified
		</Badge>
	);
};
