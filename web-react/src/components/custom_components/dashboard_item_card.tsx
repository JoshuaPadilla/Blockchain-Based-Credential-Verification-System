import type { LucideIcon } from "lucide-react";
import React, { type ReactElement } from "react";

type Props = {
	title: string;
	icon: ReactElement;
	value: string;
	children?: React.ReactNode;
};

export const DashboardItemCard = ({
	title,
	icon: Icon,
	value,
	children,
}: Props) => {
	return (
		<div className="p-6 flex-1 flex flex-col gap-2 rounded-xl bg-white">
			<div className="flex items-center gap-2 ">
				{Icon}{" "}
				<p className="text-black/50 font-heading text-xl">{title}</p>
			</div>
			<h1 className=" font-mono font-extrabold text-4xl">{value}</h1>

			{children}
		</div>
	);
};
