import React from "react";
import { TableCell } from "../ui/table";
import type { CredentialEnumType } from "@/enums/credential_type.enum";

type Props = {
	credential_type: CredentialEnumType;
};

export const TableCredentialType = ({ credential_type }: Props) => {
	return (
		<TableCell className="font-mono text-primary/50 font-semibold text">
			{credential_type}
		</TableCell>
	);
};
