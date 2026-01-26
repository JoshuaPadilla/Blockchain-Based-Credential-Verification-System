import { Badge } from "../ui/badge";
import { ClockAlert } from "lucide-react";

export const ExpiredBadge = () => {
	return (
		<Badge
			variant="default"
			className="text-red-800 font-mono border border-red-400 bg-red-200"
		>
			<ClockAlert data-icon="inline-start" />
			Expired
		</Badge>
	);
};
