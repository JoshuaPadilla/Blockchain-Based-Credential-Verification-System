import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getCredentialStyle } from "@/helpers/get_credential_style";
import type { Record } from "@/types/record.type";
import { format } from "date-fns";

type Props = {
	records: Record[];
};

export const SignerQueueTable = ({ records }: Props) => {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			{/* Desktop Table Header - Completely hidden on mobile */}
			<Table className="w-full">
				<TableHeader className="hidden md:table-header-group bg-slate-50/50">
					<TableRow className="hover:bg-transparent border-slate-100">
						<TableHead className="w-[250px] font-bold text-xs uppercase tracking-wider text-slate-500 py-4 pl-6">
							Student
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Credential Type
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Date Issued
						</TableHead>
						<TableHead className="w-[200px] font-bold text-xs uppercase tracking-wider text-slate-500">
							Signature Progress
						</TableHead>
						<TableHead className="text-right font-bold text-xs uppercase tracking-wider text-slate-500 pr-6">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="block md:table-row-group">
					{records.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-24 text-center text-sm text-slate-500"
							>
								No pending requests found.
							</TableCell>
						</TableRow>
					) : (
						records.map((record) => {
							const { firstName, lastName, student_id } =
								record.student;
							const current = record.currentSignatures;
							const total =
								record.credentialType.requiredSignaturesCount ||
								3;
							const progressPercentage = Math.round(
								(current / total) * 100,
							);

							return (
								<TableRow
									key={record.id}
									className="block md:table-row border-b border-slate-100 md:hover:bg-slate-50 transition-colors p-4 md:p-0"
								>
									{/* Student Info - Acts as the card header on mobile */}
									<TableCell className="block md:table-cell py-2 md:py-4 md:pl-6 align-middle">
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`}
												/>
												<AvatarFallback>
													{firstName[0]}
													{lastName[0]}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-semibold text-slate-900 leading-none">
													{firstName} {lastName}
												</span>
												<span className="text-xs text-slate-500 mt-1">
													ID: {student_id || "N/A"}
												</span>
											</div>
										</div>
									</TableCell>

									{/* Credential & Date - Grouped horizontally on mobile */}
									<TableCell className="block md:table-cell py-2 md:py-4">
										<div className="flex flex-wrap items-center gap-2 md:block">
											<span
												className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${getCredentialStyle(
													record.credentialType.name,
												)}`}
											>
												{record.credentialType.name.replace(
													/_/g,
													" ",
												)}
											</span>
											<span className="md:hidden text-xs text-slate-400">
												•
											</span>
											<span className="text-sm text-slate-600 md:hidden">
												{format(
													new Date(record.createdAt),
													"MMM d, yyyy",
												)}
											</span>
										</div>
									</TableCell>

									{/* Date Issued - Only visible in table mode */}
									<TableCell className="hidden md:table-cell text-sm text-slate-600 font-medium">
										{format(
											new Date(record.createdAt),
											"MMM d, yyyy",
										)}
									</TableCell>

									{/* Progress - Full width on mobile */}
									<TableCell className="block md:table-cell py-2 md:py-4">
										<div className="w-full md:max-w-[200px] space-y-1.5">
											<div className="flex justify-between text-xs font-medium text-slate-500">
												<span>
													Step {current} of {total}
												</span>
												<span>
													{progressPercentage}%
												</span>
											</div>
											<Progress
												value={progressPercentage}
												className="h-2 bg-slate-100"
											/>
										</div>
									</TableCell>

									{/* Action - Right-aligned or full-width button */}
									<TableCell className="block md:table-cell py-3 md:py-4 md:pr-6 text-right">
										<Button
											className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
											size="sm"
										>
											Review Request
										</Button>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
