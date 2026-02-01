import { TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/date_utils";

type Props = {
	issuedAt: Date;
};

export const TableDateIssued = ({ issuedAt }: Props) => {
	return (
		<TableCell className="text-sm font-medium text-slate-600">
			{formatDate(issuedAt)}
		</TableCell>
	);
};
