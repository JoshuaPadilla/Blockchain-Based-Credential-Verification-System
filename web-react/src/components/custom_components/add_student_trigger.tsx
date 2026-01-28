import React from "react";
import { Button } from "../ui/button";
import { UserSearch } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type Props = {
	handleClick: () => void;
};

export const AddStudentTrigger = ({ handleClick }: Props) => {
	return (
		<div className="col-span-2 row-span-1 flex-1 border border-black/30 rounded-lg bg-white shadow p-4">
			{/* title */}
			<div className="flex gap-2 items-center mb-4">
				<UserSearch />
				<p className="font-medium font-mono text-lg">
					Select a student
				</p>
			</div>

			{/* button */}
			<div className="flex-1 mb-4">
				<Button
					variant={"default"}
					onClick={handleClick}
					className="w-full"
				>
					Select student
				</Button>
			</div>

			<h2 className="font-mono text-base mb-2">Selected Student:</h2>
			{/* student card */}
			<div className="flex gap-2 border border-black/30 p-4 items-center rounded-lg">
				<Avatar size="lg">
					<AvatarImage
						src="https://github.com/shadcn.png"
						alt="@shadcn"
						className="grayscale"
					/>
				</Avatar>

				<div>
					<h1 className="font-mono">22-00377</h1>
					<p className="font-mono text-sm text-accent-foreground">
						Joshua Vincent Padilla
					</p>
				</div>
			</div>
		</div>
	);
};
