import React from "react";
import { TableCell } from "../ui/table";
import { Loader } from "lucide-react";

export const TableCredentialStatus = () => {
	return (
		<TableCell>
			<div className="flex flex-row gap-2 rounded-full border w-fit px-4 border-amber-500 bg-amber-400/30 items-center justify-end">
				<Loader size={15} color="oklch(47.3% 0.137 46.201)" />
				<p className="font-mono font-semibold text-amber-800/70">
					Pending
				</p>
			</div>
		</TableCell>
	);
};
