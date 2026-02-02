import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell } from "@/components/ui/table";

type Props = {
	firstName: string;
	middleName?: string; // made optional just in case
	lastName: string;
};

export const TableStudentName = ({
	firstName,
	middleName,
	lastName,
}: Props) => {
	const initials = `${firstName[0]}${lastName[0]}`;
	console.log(middleName);

	return (
		<TableCell className="py-4 pl-6">
			<div className="flex items-center gap-3">
				<Avatar className="h-9 w-9 border border-slate-200">
					<AvatarImage
						src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`}
					/>
					<AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-bold text-sm text-slate-900">
						{firstName} {lastName}
					</span>
					<span className="text-xs text-slate-500">Student</span>
				</div>
			</div>
		</TableCell>
	);
};
