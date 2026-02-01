import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
	txHash: string;
};

export const TableTxHash = ({ txHash }: Props) => {
	const [copied, setCopied] = useState(false);
	const toDisplay = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(txHash);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<TableCell>
			<div className="flex items-center gap-2 group/hash">
				<code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
					{toDisplay}
				</code>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 text-slate-400 hover:text-slate-700 opacity-0 group-hover/hash:opacity-100 transition-opacity"
					onClick={handleCopy}
				>
					{copied ? (
						<Check className="size-3" />
					) : (
						<Copy className="size-3" />
					)}
				</Button>
			</div>
		</TableCell>
	);
};
