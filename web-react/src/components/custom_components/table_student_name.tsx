import React from "react";
import { TableCell } from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";

type Props = {
	profile: string;
	name: string;
};

export const TableStudentName = () => {
	return (
		<TableCell className="flex flex-row gap-3 items-center">
			<Avatar>
				<AvatarImage
					src="https://github.com/shadcn.png"
					alt="@shadcn"
				/>
			</Avatar>

			<div>
				<p className="font-mono font-semibold">Joshua Vincent</p>
				<p className="font-mono font-semibold">Padilla</p>
			</div>
		</TableCell>
	);
};
