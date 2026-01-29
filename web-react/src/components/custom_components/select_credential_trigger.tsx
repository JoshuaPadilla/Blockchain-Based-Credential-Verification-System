import { Award, FileBadge, UserSearch } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";

export const SelectCredentialTrigger = () => {
	return (
		<div className="flex-1 max-h-fit border border-black/30 rounded-lg bg-white shadow p-4">
			{/* header */}
			<div className="flex justify-between items-center mb-4">
				{/* title */}
				<div className="flex items-center gap-2">
					<UserSearch color="#114cd4" />
					<p className="font-semibold font-mono text-sm">
						Select student
					</p>
				</div>

				<Button
					variant={"ghost"}
					onClick={() => {}}
					className="self-center"
				>
					<p className="font-bold font-mono text-button-primary">
						Pick
					</p>
				</Button>
			</div>

			<h2 className="font-mono text-base mb-2">Selected Credential:</h2>
			{/* selected credential card */}
			<div className="flex gap-2 border border-black/30 p-4 items-center rounded-lg">
				<Award className="size-8" />

				<h1 className="font-mono">Diploma</h1>
			</div>
		</div>
	);
};
