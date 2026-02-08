import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming shadcn avatar
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Assuming you have this shadcn component
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
import { format } from "date-fns"; // Standard date formatting

type Props = {
	records: Record[];
};

// Helper to map your specific types to colors (based on screenshot)

export const SignerQueueTable = ({ records }: Props) => {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-slate-50/50">
					<TableRow className="hover:bg-transparent border-slate-100">
						<TableHead className="w-[300px] font-bold text-xs uppercase tracking-wider text-slate-500 py-4 pl-6">
							Student
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Credential Type
						</TableHead>
						<TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
							Date Issued
						</TableHead>
						<TableHead className="w-[250px] font-bold text-xs uppercase tracking-wider text-slate-500">
							Signature Progress
						</TableHead>
						<TableHead className="text-left font-bold text-xs uppercase tracking-wider text-slate-500 pr-6 w-25">
							Action
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
								No pending requests found.
							</td>
						</TableRow>
					) : (
						records.map((record) => {
							console.log(
								"Processing record:",
								record.currentSignatures,
								record.credentialType.requiredSignaturesCount,
							);

							const { firstName, lastName, student_id } =
								record.student; // Assuming student has 'id' field

							// Progress Logic
							const current = record.currentSignatures;
							const total =
								record.credentialType.requiredSignaturesCount ||
								3; // Fallback to 3 if undefined
							const progressPercentage = Math.round(
								(current / total) * 100,
							);

							return (
								<TableRow
									key={record.id}
									className="group hover:bg-slate-50 border-slate-100 transition-colors"
								>
									{/* Student Column */}
									<TableCell className="py-4 pl-6 text-left">
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
												<span className="font-semibold text-slate-900">
													{firstName} {lastName}
												</span>
												<span className="text-xs text-slate-500">
													ID: {student_id || "N/A"}
												</span>
											</div>
										</div>
									</TableCell>

									{/* Credential Type Badge */}
									<TableCell className="text-left">
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${getCredentialStyle(record.credentialType.name)}`}
										>
											{record.credentialType.name.replace(
												/_/g,
												" ",
											)}
										</span>
									</TableCell>

									{/* Date Issued */}
									<TableCell className="text-sm text-slate-600 font-medium text-left">
										{format(
											new Date(record.createdAt),
											"MMM d, yyyy",
										)}
									</TableCell>

									{/* Signature Progress Bar */}
									<TableCell className="text-left">
										<div className="w-full max-w-[200px] space-y-1.5 ">
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
												// indicatorClassName="bg-blue-600"
											/>
										</div>
									</TableCell>

									{/* Action Button */}
									<TableCell className="text-right pr-6 w-25">
										<Button
											className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
											size="sm"
										>
											Review
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
