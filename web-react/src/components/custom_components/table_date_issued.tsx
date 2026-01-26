import React from "react";
import { TableCell } from "../ui/table";
import { formatDate } from "@/lib/date_utils";

type Props = {
	issuedAt: Date;
};
export const TableDateIssued = ({ issuedAt }: Props) => {
	return <TableCell className="">{formatDate(issuedAt)}</TableCell>;
};
