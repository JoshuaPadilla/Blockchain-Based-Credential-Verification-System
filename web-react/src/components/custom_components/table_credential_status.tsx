import React from "react";
import { TableCell } from "../ui/table";
import { Loader } from "lucide-react";
import { PendingBadge } from "./pending_badge";
import { VerifiedBadge } from "./verified_badge";
import { RevokedBadge } from "./revoked_badge";
import { ExpiredBadge } from "./expired_badge";

type Props = {
	expired: boolean;
	pending: boolean;
	revoked: boolean;
};

export const TableCredentialStatus = ({ expired, pending, revoked }: Props) => {
	return (
		<TableCell className="w-0 whitespace-nowrap min-w-60">
			<div className="flex items-center justify-start gap-2 flex-wrap">
				{expired && <ExpiredBadge />}
				{pending && <PendingBadge />}
				{revoked && <RevokedBadge />}
				{!revoked && !pending && !expired && <VerifiedBadge />}
			</div>
		</TableCell>
	);
};
