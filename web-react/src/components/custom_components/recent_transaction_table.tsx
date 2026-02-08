import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Record } from "@/types/record.type";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Download, Eye, MoreHorizontal } from "lucide-react";
import { MobileRecordTableCard } from "./mobile_table_card";
import { TableCredentialStatus } from "./table_credential_status";
import { TableCredentialType } from "./table_credential_type";
import { TableDateIssued } from "./table_date_issued";
import { TableStudentName } from "./table_student_name";
import { TableTxHash } from "./table_txhash";

type Props = {
	records: Record[];
};

export const RecentTransactionTable = ({ records }: Props) => {
	const navigate = useNavigate();

	const handleViewRecord = (id: string) => {
		navigate({
			to: "/admin/credentials/$credential_id",
			params: {
				credential_id: id,
			},
		});
	};

	return (
		<div className="space-y-4">
			{/* --- Desktop View (Table) --- */}
			<div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
							<TableHead className="text-left font-bold text-xs uppercase tracking-wider text-slate-500 pr-6">
								Status
							</TableHead>
							<TableHead className="w-12.5"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{records.length === 0 ? (
							<TableRow>
								<td
									colSpan={6}
									className="h-24 text-center text-sm text-slate-500"
								>
									No records found.
								</td>
							</TableRow>
						) : (
							records.slice(0, 5).map((record) => {
								const { firstName, middleName, lastName } =
									record.student;
								const pending =
									record.currentSignatures <
									record.credentialType
										.requiredSignaturesCount;
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
										<TableCell className="pr-6">
											<div className="text-left">
												<TableCredentialStatus
													expired={expired}
													pending={pending}
													revoked={record.revoked}
												/>
											</div>
										</TableCell>
										<TableCell>
											<RecordActions
												record={record}
												onView={handleViewRecord}
											/>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* --- Mobile View (Cards) --- */}
			<div className="md:hidden grid grid-cols-1 gap-4">
				{records.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
						No records found.
					</div>
				) : (
					records
						.slice(0, 5)
						.map((record) => (
							<MobileRecordTableCard
								key={record.id}
								record={record}
								onView={handleViewRecord}
							/>
						))
				)}
			</div>
		</div>
	);
};

// Extracted Action Menu for Reuse
export const RecordActions = ({
	record,
	onView,
}: {
	record: Record;
	onView: (id: string) => void;
}) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant="ghost"
				className="h-8 p-0 text-slate-400 hover:text-slate-600 w-12.5"
			>
				<span className="sr-only">Open menu</span>
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem
				onClick={() => navigator.clipboard.writeText(record.id)}
			>
				<Copy className="mr-2 h-4 w-4" />
				Copy ID
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={() => onView(record.id)}>
				<Eye className="mr-2 h-4 w-4" />
				View Details
			</DropdownMenuItem>
			<DropdownMenuItem>
				<Download className="mr-2 h-4 w-4" />
				Download PDF
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);
