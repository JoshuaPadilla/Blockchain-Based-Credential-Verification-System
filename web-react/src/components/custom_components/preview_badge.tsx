import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";

export const RevokedBadge = () => {
	return (
		<Badge
			variant="default"
			className="text-gray-800 font-mono border border-gray-400 bg-gray-200"
		>
			<Eye data-icon="inline-start" />
			Revoked
		</Badge>
	);
};
