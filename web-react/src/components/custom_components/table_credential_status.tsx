import { TableCell } from "@/components/ui/table";
import { AlertCircle, Ban, CheckCircle2, Clock } from "lucide-react";

type Props = {
	expired: boolean;
	pending: boolean;
	revoked: boolean;
};

export const TableCredentialStatus = ({ expired, pending, revoked }: Props) => {
	// Priority: Revoked > Expired > Pending > Valid

	let content;

	if (revoked) {
		content = (
			<div className="flex items-center gap-1.5 text-red-600">
				<Ban className="size-4" />
				<span className="text-xs font-bold uppercase">Revoked</span>
			</div>
		);
	} else if (expired) {
		content = (
			<div className="flex items-center gap-1.5 text-orange-600">
				<Clock className="size-4" />
				<span className="text-xs font-bold uppercase">Expired</span>
			</div>
		);
	} else if (pending) {
		content = (
			<div className="flex items-center gap-1.5 text-amber-600">
				<AlertCircle className="size-4" />
				<span className="text-xs font-bold uppercase">Pending</span>
			</div>
		);
	} else {
		content = (
			<div className="flex items-center gap-1.5 text-green-600">
				<CheckCircle2 className="size-4" />
				<span className="text-xs font-bold uppercase">Verified</span>
			</div>
		);
	}

	return (
		<TableCell className="pr-6">
			<div className="flex justify-end">{content}</div>
		</TableCell>
	);
};
