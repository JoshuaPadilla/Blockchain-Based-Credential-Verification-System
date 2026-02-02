import { Clock } from "lucide-react";
import { PendingBadge } from "./pending_badge";
import { RevokedBadge } from "./preview_badge";
import { VerifiedBadge } from "./verified_badge";

type Props = {
	expired: boolean;
	pending: boolean;
	revoked: boolean;
};

export const TableCredentialStatus = ({ expired, pending, revoked }: Props) => {
	let content;

	if (revoked) {
		content = <RevokedBadge />;
	} else if (expired) {
		content = (
			<div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full w-fit">
				<Clock className="size-3.5" />
				<span className="text-[10px] font-bold uppercase tracking-wide">
					Expired
				</span>
			</div>
		);
	} else if (pending) {
		content = <PendingBadge />;
	} else {
		content = <VerifiedBadge />;
	}

	// Return only the content, no TableCell
	return content;
};
