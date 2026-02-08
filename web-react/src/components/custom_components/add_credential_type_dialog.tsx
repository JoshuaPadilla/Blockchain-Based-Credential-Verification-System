import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CreateCredentialTypeDto } from "@/dto/create_credential_type.dto";
import {
	CredentialTypeEnum,
	type CredentialEnumType,
} from "@/enums/credential_type.enum";
import { cn } from "@/lib/utils"; // Ensure you have this utility
import { useCredentialTypeStore } from "@/stores/credential_type_store";
import { useUserStore } from "@/stores/user_store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Info, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

type Props = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
};

export function CreateCredentialTypeDialog({ isOpen, setOpen }: Props) {
	const queryClient = useQueryClient();
	const { getSigners } = useUserStore();
	const { createNewCredentialType } = useCredentialTypeStore();

	// --- Search State ---
	const [queryTerm, setQueryTerm] = useState("");
	const [debouncedSearch] = useDebounce(queryTerm, 500);

	// --- Form State ---
	const [selectedType, setSelectedType] = useState<CredentialEnumType>(
		CredentialTypeEnum.DIPLOMA,
	);
	const [selectedSignerIds, setSelectedSignerIds] = useState<string[]>([]);

	// --- Data Fetching ---
	const { data: signers = [], isPending: isLoadingSigners } = useQuery({
		queryKey: ["signers", debouncedSearch],
		queryFn: async () => {
			return await getSigners("signer", debouncedSearch);
		},
		placeholderData: (previousData) => previousData,
	});

	// --- Mutation ---
	const mutation = useMutation({
		mutationFn: (form: CreateCredentialTypeDto) =>
			createNewCredentialType(form),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["credential_types"] });
			toast.success("Credential standard created");
			setOpen(false);
			resetForm();
		},
		onError: () => {
			toast.error("Failed to create credential standard");
		},
	});

	const resetForm = () => {
		setSelectedType(CredentialTypeEnum.DIPLOMA);
		setSelectedSignerIds([]);
		setQueryTerm("");
	};

	// --- Logic Helpers ---
	const handleSignerToggle = (id: string) => {
		setSelectedSignerIds((prev) =>
			prev.includes(id)
				? prev.filter((signerId) => signerId !== id)
				: [...prev, id],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedSignerIds.length === 0) {
			toast.error("At least one signer must be selected.");
			return;
		}

		if (!selectedType) {
			toast.error("select Credential Type.");
			return;
		}

		mutation.mutate({
			name: selectedType,
			requiredSignaturesCount: selectedSignerIds.length,
			signerIds: selectedSignerIds,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
					<Plus className="mr-2 h-4 w-4" /> Add Configuration
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
				<DialogHeader className="p-6 pb-4 border-b">
					<DialogTitle>Configure Credential Standard</DialogTitle>
					<DialogDescription>
						Define the document type and select the authorized
						signers.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col flex-1 overflow-hidden"
				>
					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						{/* 1. Document Type Selection */}
						<div className="space-y-3">
							<Label className="text-sm font-medium">
								Document Type
							</Label>
							<Select
								value={selectedType}
								onValueChange={(value: CredentialEnumType) =>
									setSelectedType(value)
								}
								required
							>
								<SelectTrigger className="bg-gray-50/50 border-gray-200">
									<SelectValue placeholder="Select a credential type..." />
								</SelectTrigger>
								<SelectContent>
									{Object.values(CredentialTypeEnum).map(
										(type) => (
											<SelectItem key={type} value={type}>
												{type.replace(/_/g, " ")}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
						</div>

						{/* 2. Signer Selection (Replaced with Command Pattern) */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium">
									Authorized Signers
								</Label>
								<Badge
									variant="secondary"
									className="font-mono text-xs"
								>
									{selectedSignerIds.length} Selected
								</Badge>
							</div>

							{/* Using Command Component to fix the crash and match StudentSelector logic */}
							<div className="border rounded-xl bg-white shadow-sm overflow-hidden h-[280px] flex flex-col">
								<Command
									shouldFilter={false}
									className="h-full"
								>
									<CommandInput
										placeholder="Search by name or role..."
										value={queryTerm}
										onValueChange={setQueryTerm}
									/>
									<CommandList className="flex-1 overflow-y-auto">
										<CommandEmpty>
											{isLoadingSigners ? (
												<div className="py-6 flex justify-center items-center gap-2 text-xs text-slate-500">
													<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
													Searching signers...
												</div>
											) : (
												<div className="py-6 text-center text-xs text-slate-500">
													No signers found.
												</div>
											)}
										</CommandEmpty>

										<CommandGroup>
											{signers.map((signer: any) => {
												const isSelected =
													selectedSignerIds.includes(
														signer.id,
													);
												return (
													<CommandItem
														key={signer.id}
														value={signer.id} // Important for internal keys
														onSelect={() =>
															handleSignerToggle(
																signer.id,
															)
														}
														className="cursor-pointer aria-selected:bg-slate-100"
													>
														{/* Check Icon (Visible if selected) */}
														<Check
															className={cn(
																"mr-2 h-4 w-4 text-blue-600 transition-opacity",
																isSelected
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>

														{/* Avatar & Details */}
														<div className="flex items-center gap-3 w-full">
															<Avatar className="h-8 w-8 border border-gray-200">
																<AvatarImage
																	src={`https://api.dicebear.com/7.x/initials/svg?seed=${signer.firstName}`}
																/>
																<AvatarFallback className="text-[10px] bg-white text-gray-500">
																	{
																		signer
																			.firstName?.[0]
																	}
																	{
																		signer
																			.lastName?.[0]
																	}
																</AvatarFallback>
															</Avatar>

															<div className="flex flex-col">
																<span className="text-sm font-medium leading-none text-gray-900">
																	{
																		signer.firstName
																	}{" "}
																	{
																		signer.middleName
																	}{" "}
																	{
																		signer.lastName
																	}
																</span>
																<span className="text-xs text-gray-500 mt-1">
																	{signer.role ||
																		"Signer"}
																</span>
															</div>
														</div>
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>
								</Command>
							</div>
						</div>

						{/* 3. Summary */}
						<div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
							<Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
							<div className="space-y-1">
								<p className="text-sm font-medium text-gray-900">
									Required Signatures
								</p>
								<p className="text-xs text-gray-500 leading-relaxed">
									This document type will require approval
									from{" "}
									<span className="font-bold text-gray-900">
										all {selectedSignerIds.length}
									</span>{" "}
									selected signers to be considered valid.
								</p>
							</div>
						</div>
					</div>

					<DialogFooter className="p-6 border-t bg-gray-50/50">
						<Button
							type="button" // Important: prevents form submission
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700"
							disabled={
								mutation.isPending ||
								!selectedType ||
								selectedSignerIds.length === 0
							}
						>
							{mutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
									Saving...
								</>
							) : (
								"Save Configuration"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
