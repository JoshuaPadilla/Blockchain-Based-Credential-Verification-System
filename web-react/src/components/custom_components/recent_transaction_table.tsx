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

export const RecentTransactionTable = () => {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow className="font-sans">
						<TableHead>STUDENT NAME</TableHead>
						<TableHead>CREDENTIAL TYPE</TableHead>
						<TableHead>TRANSACTION HASH</TableHead>
						<TableHead>DATE ISSUED</TableHead>
						<TableHead>STATUS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow className="">
						<TableStudentName />
						<TableCredentialType />
						<TableTxHash />
						<TableDateIssued />
						<TableCredentialStatus />
					</TableRow>
					<TableRow className="">
						<TableStudentName />
						<TableCredentialType />
						<TableTxHash />
						<TableDateIssued />
						<TableCredentialStatus />
					</TableRow>
					<TableRow className="">
						<TableStudentName />
						<TableCredentialType />
						<TableTxHash />
						<TableDateIssued />
						<TableCredentialStatus />
					</TableRow>
					<TableRow className="">
						<TableStudentName />
						<TableCredentialType />
						<TableTxHash />
						<TableDateIssued />
						<TableCredentialStatus />
					</TableRow>
					<TableRow className="">
						<TableStudentName />
						<TableCredentialType />
						<TableTxHash />
						<TableDateIssued />
						<TableCredentialStatus />
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
};
