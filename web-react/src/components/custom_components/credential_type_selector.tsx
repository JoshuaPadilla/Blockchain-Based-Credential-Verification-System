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
import { useCredentialTypeStore } from "@/stores/credential_type_store";
import type { CredentialType } from "@/types/credential_type.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Check,
	ChevronDown,
	FileBadge,
	FileStack,
	ShieldCheck,
	Users,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
	onSelectCredential: (credential: CredentialType) => void;
}

export function CredentialTypeSelector({ onSelectCredential }: Props) {
	const [open, setOpen] = useState(false);
	const [selectedCredential, setSelectedCredential] =
		useState<CredentialType | null>(null);
	const { fetchCredentialTypes } = useCredentialTypeStore();

	const [searchTerm] = useState("");
	const [debouncedSearch] = useDebounce(searchTerm, 500);

	// Fetch Logic
	const { data: credentialTypes = [], isLoading } = useSuspenseQuery({
		queryKey: ["fetch_credential_types", debouncedSearch],
		queryFn: () => fetchCredentialTypes(debouncedSearch),
	});

	const handleSelectCredential = (credential: CredentialType) => {
		setSelectedCredential(credential);
		onSelectCredential(credential);
		setOpen(false);
	};

	return (
		<div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
			{/* --- Header & Trigger --- */}
			<div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-blue-100 rounded-md text-[var(--button-primary)]">
						<FileStack className="size-4" />
					</div>
					<span className="font-heading font-bold text-sm text-slate-800">
						Credential Template
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
							{selectedCredential ? (
								<span className="font-semibold text-slate-900 truncate">
									{selectedCredential.name}
								</span>
							) : (
								<span className="text-slate-400 font-normal">
									Select a template...
								</span>
							)}
							<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-[300px] p-0" align="start">
						<Command>
							<CommandInput placeholder="Search templates..." />
							<CommandList>
								<CommandEmpty>
									{isLoading ? (
										<div className="py-6 flex justify-center">
											<Spinner className="size-5 text-[var(--button-primary)]" />
										</div>
									) : (
										<div className="py-6 text-center text-xs text-slate-500">
											No templates found.
										</div>
									)}
								</CommandEmpty>
								<CommandGroup>
									{credentialTypes.map((credential) => (
										<CommandItem
											key={credential.id}
											value={credential.name}
											onSelect={() =>
												handleSelectCredential(
													credential,
												)
											}
											className="cursor-pointer"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4 text-[var(--button-primary)]",
													selectedCredential?.id ===
														credential.id
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											<div className="flex flex-col">
												<span className="font-medium text-slate-900">
													{credential.name}
												</span>
												<span className="text-[10px] text-slate-500">
													Requires{" "}
													{credential.signers.length}{" "}
													signatures
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			{/* --- Content Area --- */}
			<div className="p-4 bg-white min-h-[140px]">
				{selectedCredential ? (
					<div className="animate-in fade-in zoom-in-95 duration-200">
						{/* Selected Header */}
						<div className="flex items-center gap-3 mb-6">
							<div className="size-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
								<FileBadge className="size-5 text-[var(--button-primary)]" />
							</div>
							<div>
								<h3 className="font-heading font-bold text-slate-900 leading-tight">
									{selectedCredential.name}
								</h3>
								<div className="flex items-center gap-1.5 mt-0.5">
									<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
										Standard v1.0
									</span>
								</div>
							</div>
						</div>

						{/* Signers List */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
									<Users className="size-3.5" /> Required
									Signers
								</h4>
								<span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
									{selectedCredential.signers.length}
								</span>
							</div>

							<div className="bg-slate-50/50 rounded-lg border border-slate-100 divide-y divide-slate-100">
								{selectedCredential.signers.map(
									(signer, index) => (
										<div
											key={index}
											className="flex items-center gap-3 p-3"
										>
											<Avatar className="size-8 border border-white shadow-sm">
												<AvatarImage
													src={`https://api.dicebear.com/7.x/initials/svg?seed=${signer.firstName} ${signer.lastName}`}
												/>
												<AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
													{signer.firstName[0]}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-bold text-slate-900 truncate">
													{signer.firstName}{" "}
													{signer.middleName}{" "}
													{signer.lastName}
												</p>
												<div className="flex items-center gap-1.5 text-[10px] text-slate-500">
													<ShieldCheck className="size-3 text-green-500" />
													<span className="truncate">
														{(
															signer.signerPosition ||
															""
														).toUpperCase()}
													</span>
												</div>
											</div>
										</div>
									),
								)}
							</div>
						</div>
					</div>
				) : (
					// Empty State
					<div className="h-full flex flex-col items-center justify-center text-center py-6 gap-3 opacity-60">
						<div className="p-3 bg-slate-50 rounded-full">
							<FileBadge className="size-6 text-slate-400" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-semibold text-slate-600">
								No Template Selected
							</p>
							<p className="text-xs text-slate-400 max-w-[200px] mx-auto">
								Choose a credential type above to view the
								authorized signers.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
