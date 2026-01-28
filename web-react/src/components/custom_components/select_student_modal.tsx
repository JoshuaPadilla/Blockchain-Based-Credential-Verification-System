import React from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

type Props = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export const SelectStudentModal = ({ isOpen, setIsOpen }: Props) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<div>Select student</div>
			</DialogContent>
		</Dialog>
	);
};
