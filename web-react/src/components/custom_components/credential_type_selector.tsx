"use client";

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
import { useCredentialTypeStore } from "@/stores/credential_type_store";
import type { CredentialType } from "@/types/credential_type.type";
import { useQuery } from "@tanstack/react-query";
import { Check, FileBadge, FileStack, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";

// MOCK DATA: Replace this with your API data

interface Props {
	onSelectCredential: (credential: CredentialType) => void;
}

export function CredentialTypeSelector({ onSelectCredential }: Props) {
	const [searchQuery, setSearchQuery] = useState("");

	const { fetchCredentialTypes } = useCredentialTypeStore();

	// 3. THE SEARCH: TanStack Query "listens" to the DELAYED state
	const { data: credentialTypes = [], isLoading } = useQuery({
		// logic: When 'debouncedSearch' changes, this query fires automatically
		queryKey: ["fetch_credntial_types"],
		queryFn: fetchCredentialTypes,
	});

	const [open, setOpen] = useState(false);
	const [selectedCredential, setSelectedCredential] =
		useState<CredentialType | null>(null);

	const handleSelectCredntial = (credential: CredentialType) => {
		setSelectedCredential(credential);
		onSelectCredential(credential);
		setOpen(false);
	};

	// Find the full student object based on ID

	return (
		<div className="w-full bg-white rounded-xl border shadow-sm p-4">
			{/* HEADER: Title + Pick Button */}
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2  font-medium">
					<FileStack className="w-5 h-5" color="#256af4" />
					<span className="font-mono text-xs text-primary">
						Select Credential
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
						<Command>
							<CommandInput
								placeholder="Search credential name..."
								value={searchQuery}
								onValueChange={setSearchQuery}
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
									{credentialTypes.map((credential) => {
										return (
											<CommandItem
												key={credential.id}
												value={credential.name}
												onSelect={() => {
													handleSelectCredntial(
														credential,
													);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														selectedCredential?.id ===
															credential.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div className="flex gap-2 p-2">
													<FileBadge />
													<span className="text-xs text-muted-foreground">
														{credential.name}
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
			{selectedCredential ? (
				<>
					<div className="flex items-center gap-4 border-2 border-dashed border-button-primary rounded-lg p-3 bg-gray-50/50">
						<div className="h-12 w-12 border-2 bg-blue-100 flex items-center justify-center rounded-sm shadow-sm">
							<FileBadge color="#256af4" />
						</div>

						<div className="flex flex-col">
							<span className="text-sm font-semibold text-gray-900">
								{selectedCredential.name.toUpperCase()}
							</span>
						</div>
					</div>

					<div className="flex gap-2 items-center mt-4">
						<UserRoundPen color="#256af4" className="size-4" />
						<h3 className="font-mono text-xs">
							Credential Signers:
						</h3>
					</div>

					<div className="flex flex-col p-2 gap-4 bg-background mt-4 rounded-md">
						{selectedCredential.signers.map((signer) => {
							return (
								<div className="flex gap-2 items-center p-2">
									<Avatar className="size-10 border-2 border-white shadow-sm">
										<AvatarImage alt={signer.firstName} />
										<AvatarFallback className="bg-slate-200 text-slate-600">
											{signer.firstName
												.charAt(0)
												.toLocaleUpperCase()}
										</AvatarFallback>
									</Avatar>

									<div>
										<h3 className="font-heading text-sm">
											{signer.firstName}{" "}
											{signer.middleName}{" "}
											{signer.lastName}
										</h3>
										<p className="font-mono text-xs text-primary font-medium">
											COLLEGE{" "}
											{signer.signerPosition.toUpperCase()}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</>
			) : (
				// Empty State Placeholder
				<div className="flex items-center justify-center h-18 border border-dashed rounded-lg bg-gray-50 text-muted-foreground text-sm">
					No credential selected
				</div>
			)}
		</div>
	);
}
