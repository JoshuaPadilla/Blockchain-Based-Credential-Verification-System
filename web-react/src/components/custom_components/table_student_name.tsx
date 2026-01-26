import React from "react";
import { TableCell } from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";

type Props = {
	firstName: string;
	middleName: string;
	lastName: string;
};

export const TableStudentName = ({
	firstName,
	middleName,
	lastName,
}: Props) => {
	return (
		<TableCell className="flex flex-row gap-3 items-center">
			<Avatar>
				<AvatarImage
					src="https://github.com/shadcn.png"
					alt="@shadcn"
				/>
			</Avatar>

			<div>
				<p className="font-mono font-semibold">
					{firstName} {middleName.charAt(0)}.
				</p>
				<p className="font-mono font-semibold">{lastName}</p>
			</div>
		</TableCell>
	);
};
