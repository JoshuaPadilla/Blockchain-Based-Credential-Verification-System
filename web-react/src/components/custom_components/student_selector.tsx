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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useStudentStore } from "@/stores/student_store";
import type { Student } from "@/types/student.type";
import { useQuery } from "@tanstack/react-query";
import {
	Check,
	ChevronDown,
	GraduationCap,
	Search,
	UserCircle,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface StudentSelectorProps {
	onSelectStudent: (student: Student) => void;
}

export function StudentSelector({ onSelectStudent }: StudentSelectorProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch] = useDebounce(searchTerm, 500);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null,
	);

	const { fetchStudent } = useStudentStore();

	// Search Query
	const { data: students = [], isLoading } = useQuery({
		queryKey: ["fetch_students", debouncedSearch],
		queryFn: () => fetchStudent(debouncedSearch),
		enabled: true, // Always enabled to allow initial fetch or empty state
	});

	const handleSelectStudent = (student: Student) => {
		setSelectedStudent(student);
		onSelectStudent(student);
		setOpen(false);
	};

	return (
		<div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
			{/* --- Header & Trigger --- */}
			<div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
						<GraduationCap className="size-4" />
					</div>
					<span className="font-heading font-bold text-sm text-slate-800">
						Student Identity
					</span>
				</div>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between bg-white text-slate-700 hover:bg-slate-50 border-slate-200 h-11"
						>
							{selectedStudent ? (
								<span className="font-semibold text-slate-900 truncate flex items-center gap-2">
									<Avatar className="size-5">
										<AvatarImage
											src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedStudent.firstName}`}
										/>
										<AvatarFallback className="text-[9px]">
											{selectedStudent.firstName[0]}
										</AvatarFallback>
									</Avatar>
									{selectedStudent.firstName}{" "}
									{selectedStudent.lastName}
								</span>
							) : (
								<span className="text-slate-400 font-normal flex items-center gap-2">
									<Search className="size-3.5" />
									Search by name or ID...
								</span>
							)}
							<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-[300px] p-0" align="start">
						<Command shouldFilter={false}>
							<CommandInput
								placeholder="Type to search..."
								value={searchTerm}
								onValueChange={setSearchTerm}
							/>
							<CommandList>
								<CommandEmpty>
									{isLoading ? (
										<div className="py-6 flex justify-center items-center gap-2 text-xs text-slate-500">
											<Spinner className="size-4" />{" "}
											Searching directory...
										</div>
									) : (
										<div className="py-6 text-center text-xs text-slate-500">
											No student found.
										</div>
									)}
								</CommandEmpty>
								<CommandGroup>
									{students.map((student) => {
										const fullname = `${student.firstName} ${student.middleName} ${student.lastName}`;
										const isSelected =
											selectedStudent?.id === student.id;

										return (
											<CommandItem
												key={student.id}
												value={student.id}
												onSelect={() =>
													handleSelectStudent(student)
												}
												className="cursor-pointer"
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4 text-[var(--button-primary)]",
														isSelected
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div className="flex items-center gap-3 w-full">
													<Avatar className="size-8 border border-slate-100">
														<AvatarImage
															src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}`}
														/>
														<AvatarFallback className="bg-slate-100 text-xs">
															{
																student
																	.firstName[0]
															}
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col min-w-0">
														<span className="font-medium text-slate-900 truncate">
															{fullname}
														</span>
														<span className="text-[10px] text-slate-500 font-mono">
															{student.student_id}
														</span>
													</div>
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

			{/* --- Selected State Display (ID Card Look) --- */}
			<div className="p-4 bg-white min-h-[140px]">
				{selectedStudent ? (
					<div className="animate-in fade-in zoom-in-95 duration-200">
						{/* Student Card */}
						<div className="flex items-start gap-4">
							<div className="relative">
								<Avatar className="size-16 rounded-xl border-2 border-white shadow-md">
									<AvatarImage
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedStudent.firstName} ${selectedStudent.lastName}`}
										className="object-cover"
									/>
									<AvatarFallback className="bg-slate-200 text-slate-500 text-xl font-bold rounded-xl">
										{selectedStudent.firstName[0]}
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white size-4 rounded-full" />
							</div>

							<div className="space-y-1 mt-1">
								<h3 className="font-heading font-bold text-lg text-slate-900 leading-none">
									{selectedStudent.firstName}{" "}
									{selectedStudent.lastName}
								</h3>
								<div className="flex items-center gap-1.5 bg-slate-100 w-fit px-2 py-0.5 rounded text-[10px] font-mono font-medium text-slate-600">
									<span>ID:</span>
									<span className="text-slate-900">
										{selectedStudent.student_id}
									</span>
								</div>
							</div>
						</div>

						{/* Meta Details (Mocked for visual balance) */}
						<div className="mt-4 grid grid-cols-2 gap-2">
							<div className="bg-slate-50 p-2 rounded border border-slate-100">
								<p className="text-[10px] text-slate-400 uppercase font-bold">
									Status
								</p>
								<p className="text-xs font-semibold text-green-600">
									Active Student
								</p>
							</div>
							<div className="bg-slate-50 p-2 rounded border border-slate-100">
								<p className="text-[10px] text-slate-400 uppercase font-bold">
									Records
								</p>
								<p className="text-xs font-semibold text-slate-700">
									View History
								</p>
							</div>
						</div>
					</div>
				) : (
					// Empty State Placeholder
					<div className="h-full flex flex-col items-center justify-center text-center py-6 gap-3 opacity-60">
						<div className="p-3 bg-slate-50 rounded-full">
							<UserCircle className="size-6 text-slate-400" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-semibold text-slate-600">
								No Student Selected
							</p>
							<p className="text-xs text-slate-400 max-w-[200px] mx-auto">
								Search for a student by name or ID to issue a
								credential.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
