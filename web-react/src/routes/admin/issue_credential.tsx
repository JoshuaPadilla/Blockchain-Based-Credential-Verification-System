import { AddStudentTrigger } from "@/components/custom_components/add_student_trigger";
import { SelectStudentModal } from "@/components/custom_components/select_student_modal";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/issue_credential")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isOPen, setIsOpen] = useState(false);

	const handleSelectStudent = () => {
		setIsOpen(true);
	};

	return (
		<>
			<SelectStudentModal isOpen={isOPen} setIsOpen={setIsOpen} />

			<div className="flex flex-col flex-1 justify-start items-center p-8 gap-8">
				<h3 className="font-mono font-extrabold text-3xl">
					Issue New Credential
				</h3>

				<div className="py-8 px-16 grid grid-cols-8 grid-rows-2 gap-2  w-full h-full">
					<AddStudentTrigger handleClick={handleSelectStudent} />
				</div>
			</div>
		</>
	);
}
