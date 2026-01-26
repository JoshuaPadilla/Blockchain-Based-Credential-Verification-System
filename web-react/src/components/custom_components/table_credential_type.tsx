import React from "react";
import { TableCell } from "../ui/table";

type Props = {
	credential_type: string;
};

export const TableCredentialType = () => {
	return (
		<TableCell className="font-mono text-primary/50 font-semibold text">
			TOR
		</TableCell>
	);
};
