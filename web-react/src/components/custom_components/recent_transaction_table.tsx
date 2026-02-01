import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Record } from "@/types/record.type";
import { TableCredentialStatus } from "./table_credential_status";
import { TableCredentialType } from "./table_credential_type";
import { TableDateIssued } from "./table_date_issued";
import { TableStudentName } from "./table_student_name";
import { TableTxHash } from "./table_txhash";

type Props = {
	records: Record[];
};

export const RecentTransactionTable = ({ records }: Props) => {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-slate-50/50">
					<TableRow className="hover:bg-transparent border-slate-100">
						<TableHead className="w-[250px] font-bold text-xs uppercase tracking-wider text-slate-500 py-4 pl-6">
							Student Identity
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Credential Type
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Tx Hash
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Issued Date
						</TableHead>
						<TableHead className="text-right font-bold text-xs uppercase tracking-wider text-slate-500 pr-6">
							Status
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{records.length === 0 ? (
						<TableRow>
							<td
								colSpan={5}
								className="h-24 text-center text-sm text-slate-500"
							>
								No records found.
							</td>
						</TableRow>
					) : (
						records.slice(0, 5).map((record) => {
							// Limit to 5 strictly for "Recent"
							const { firstName, middleName, lastName } =
								record.student;
							const pending =
								record.currentSignatures <
								record.credentialType.requiredSignaturesCount;
							const expired =
								record.expiration > 0 &&
								Date.now() > Number(record.expiration);

							return (
								<TableRow
									key={record.id}
									className="group hover:bg-slate-50 border-slate-100 transition-colors"
								>
									<TableStudentName
										firstName={firstName}
										middleName={middleName}
										lastName={lastName}
									/>
									<TableCredentialType
										credential_type={
											record.credentialType.name
										}
									/>
									<TableTxHash txHash={record.txHash} />
									<TableDateIssued
										issuedAt={record.createdAt}
									/>
									<TableCredentialStatus
										expired={expired}
										pending={pending}
										revoked={record.revoked}
									/>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
