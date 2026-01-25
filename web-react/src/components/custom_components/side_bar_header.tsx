import React from "react";
import logo from "@/assets/img/che (1).png";
import { ShieldCheck } from "lucide-react";

export const SideBarHeaderCustom = () => {
	return (
		<div className="p-2 flex flex-row gap-4 items-center">
			<div className="bg-black p-1.5 rounded-md">
				<ShieldCheck className="size-7 text-white" />
			</div>

			<div className="m-0 p-0">
				<h3 className="text-xl font-bold font-heading">
					CredentialChain
				</h3>
				<p className="text-sm font-semibold font-mono">Admin</p>
			</div>
		</div>
	);
};
