import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { TableStudentName } from "./table_student_name";
import { TableCredentialType } from "./table_credential_type";
import { TableTxHash } from "./table_txhash";
import { TableDateIssued } from "./table_date_issued";
import { TableCredentialStatus } from "./table_credential_status";
import { Button } from "../ui/button";
import type { Record } from "@/types/record.type";

type Props = {
	records: Record[];
};

export const RecentTransactionTable = ({ records }: Props) => {
	return (
		<div className="max-h-125 overflow-y-auto rounded-md">
			<Table>
				<TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
					<TableRow className="font-sans">
						<TableHead>STUDENT NAME</TableHead>
						<TableHead>CREDENTIAL TYPE</TableHead>
						<TableHead>TRANSACTION HASH</TableHead>
						<TableHead>DATE ISSUED</TableHead>
						<TableHead className="w-0 whitespace-nowrap">
							STATUS
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{records.map((record) => {
						const { firstName, middleName, lastName } =
							record.student;

						const pending =
							record.currentSignatures <
							record.credentialType.requiredSignaturesCount;

						const expired = Date.now() > Number(record.expiration);

						return (
							<TableRow key={record.id}>
								<TableStudentName
									firstName={firstName}
									middleName={middleName}
									lastName={lastName}
								/>
								<TableCredentialType
									credential_type={record.credentialType.name}
								/>
								<TableTxHash txHash={record.txHash} />
								<TableDateIssued issuedAt={record.createdAt} />
								<TableCredentialStatus
									expired={expired}
									pending={pending}
									revoked={record.revoked}
								/>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
