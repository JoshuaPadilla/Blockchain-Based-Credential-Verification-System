import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date_utils";
import type { Record } from "@/types/record.type";
import { RecordActions } from "./recent_transaction_table";
import { TableCredentialStatus } from "./table_credential_status";
import { TableTxHash } from "./table_txhash";

type Props = {
	record: Record;
};

export const MobileRecordTableCard = ({ record }: Props) => {
	const { firstName, lastName } = record.student;
	const initials = `${firstName[0]}${lastName[0]}`;

	// Status Logic Reuse
	const pending =
		record.currentSignatures <
		record.credentialType.requiredSignaturesCount;
	const expired =
		record.expiration > 0 && Date.now() > Number(record.expiration);

	return (
		<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
			{/* Header: Student Info & Actions */}
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10 border border-slate-200">
						<AvatarImage
							src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`}
						/>
						<AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-bold text-sm text-slate-900">
							{firstName} {lastName}
						</p>
						<p className="text-xs text-slate-500">
							{record.student.student_id || "Student"}
						</p>
					</div>
				</div>
				<RecordActions record={record} />
			</div>

			{/* Divider */}
			<div className="h-px bg-slate-100 w-full" />

			{/* Details Grid */}
			<div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
				{/* Credential Type */}
				<div className="space-y-1">
					<p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
						Credential
					</p>
					<div className="font-mono text-primary/80 font-semibold text-xs bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
						{record.credentialType.name.replace(/_/g, " ")}
					</div>
				</div>

				{/* Status - Reusing existing component but overriding alignment */}
				<div className="space-y-1">
					<p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">
						Status
					</p>
					<div className="[&>div]:justify-end">
						<TableCredentialStatus
							expired={expired}
							pending={pending}
							revoked={record.revoked}
						/>
					</div>
				</div>

				{/* Date */}
				<div className="space-y-1">
					<p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
						Issued Date
					</p>
					<p className="font-medium text-slate-700">
						{formatDate(record.createdAt)}
					</p>
				</div>

				{/* Tx Hash */}
				<div className="space-y-1">
					<p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">
						Blockchain Tx
					</p>
					<div className="flex justify-end [&_td]:p-0 [&_td]:border-0">
						{/* We reuse the component but strip table padding via CSS above */}
						<div className="scale-90 origin-right">
							<TableTxHash txHash={record.txHash} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
