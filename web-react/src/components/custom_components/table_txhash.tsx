import React from "react";
import { TableCell } from "../ui/table";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
	txHash: string;
};

export const TableTxHash = () => {
	const txHash =
		"0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";
	const toDisplay = `${txHash.slice(0, 4)}...${txHash.slice(-4)}`;

	return (
		<TableCell>
			<div className="flex items-center gap-2">
				<span className="p-2 bg-slate-200 rounded-sm font-mono text-primary font-light">
					{toDisplay}
				</span>

				{/* Button now only wraps the icon */}
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Copy strokeWidth={2} size={16} />
				</Button>
			</div>
		</TableCell>
	);
};
