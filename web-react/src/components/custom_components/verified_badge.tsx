import { BadgeCheck } from "lucide-react";
import { Badge } from "../ui/badge";

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
