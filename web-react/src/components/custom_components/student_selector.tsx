"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStudentStore } from "@/stores/student_store";
import type { Student } from "@/types/student.type";
import { useQuery } from "@tanstack/react-query";
import { Check, User } from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { Spinner } from "../ui/spinner";

// MOCK DATA: Replace this with your API data

interface StudentSelectorProps {
	onSelectStudent: (student: Student) => void;
}

export function StudentSelector({ onSelectStudent }: StudentSelectorProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch] = useDebounce(searchTerm, 500);

	const { fetchStudent } = useStudentStore();

	// 3. THE SEARCH: TanStack Query "listens" to the DELAYED state
	const { data: students = [], isLoading } = useQuery({
		// logic: When 'debouncedSearch' changes, this query fires automatically
		queryKey: ["fetch_students", debouncedSearch],
		queryFn: () => fetchStudent(debouncedSearch),
	});

	const [open, setOpen] = React.useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null,
	);

	const handleSelectStudent = (student: Student) => {
		setSelectedStudent(student);
		onSelectStudent(student);
		setOpen(false);
	};

	// Find the full student object based on ID

	return (
		<div className="w-full bg-white rounded-xl border shadow-sm p-4">
			{/* HEADER: Title + Pick Button */}
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2 font-medium">
					<User className="w-5 h-5" color="#256af4" />
					<span className="font-mono text-xs text-primary">
						Select student
					</span>
				</div>

				{/* The "Pick" Button that opens the Search */}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="text-blue-600 hover:text-blue-700 font-semibold h-auto p-0 hover:bg-transparent"
						>
							Pick
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-75 p-0" align="end">
						<Command shouldFilter={false}>
							<CommandInput
								placeholder="Search name or ID..."
								value={searchTerm}
								onValueChange={setSearchTerm}
							/>
							<CommandList>
								<CommandEmpty>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<Spinner className="size-6" />
										</div>
									) : (
										"No student found"
									)}
								</CommandEmpty>
								<CommandGroup>
									{students.map((student) => {
										const fullname = `${student.firstName} ${student.middleName} ${student.lastName}`;

										return (
											<CommandItem
												key={student.id}
												value={student.id}
												onSelect={() => {
													handleSelectStudent(
														student,
													);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														selectedStudent?.id ===
															student.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div className="flex flex-col">
													<span className="font-medium">
														{fullname}
													</span>
													<span className="text-xs text-muted-foreground">
														{student.student_id}
													</span>
												</div>
											</CommandItem>
										);
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			{/* DISPLAY CARD: Matches your screenshot design */}
			{selectedStudent ? (
				<div className="flex items-center gap-4 border-2 border-dashed border-button-primary rounded-lg p-3 bg-gray-50/50">
					<Avatar className="h-12 w-12 border-2 border-white shadow-sm">
						<AvatarImage alt={selectedStudent.firstName} />
						<AvatarFallback className="bg-slate-200 text-slate-600">
							{selectedStudent.firstName.charAt(0)}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col">
						<span className="text-xs font-bold text-gray-500 tracking-wide">
							{selectedStudent.student_id}
						</span>
						<span className="text-sm font-semibold text-gray-900">
							{selectedStudent.firstName}{" "}
							{selectedStudent.middleName}{" "}
							{selectedStudent.lastName}
						</span>
					</div>
				</div>
			) : (
				// Empty State Placeholder
				<div className="flex items-center justify-center h-18 border border-dashed rounded-lg bg-gray-50 text-muted-foreground text-sm">
					No student selected
				</div>
			)}
		</div>
	);
}
