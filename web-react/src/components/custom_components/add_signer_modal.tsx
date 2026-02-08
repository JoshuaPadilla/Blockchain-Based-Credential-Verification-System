import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CreateSignerDto } from "@/dto/create_signer.dto";
import { SignerPosition } from "@/enums/signer_position.enum";
import { Role } from "@/enums/user_role.enum";
import { useUserStore } from "@/stores/user_store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
};

export function CreateSignerDialog({ isOpen, setOpen }: Props) {
	const { createSigner } = useUserStore();
	const queryClient = useQueryClient();

	const initialFormState: CreateSignerDto = {
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		role: Role.SIGNER, // Constant: Not shown in UI but sent to API
		signerPosition: SignerPosition.DEAN, // Default value to ensure Tabs work
		publicAddress: "",
		privateKey: "",
	};

	const [formData, setFormData] = useState<CreateSignerDto>(initialFormState);

	const mutation = useMutation({
		mutationFn: (newSigner: CreateSignerDto) => createSigner(newSigner),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["signers"] });
			toast.success("Signer registered successfully");
			setOpen(false);
			setFormData(initialFormState);
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to register signer");
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSelectChange = (field: keyof CreateSignerDto, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
					<Plus className="mr-2 h-4 w-4" /> Add New Signer
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Register New Signer</DialogTitle>
						<DialogDescription>
							Create a new authorized signer and assign their
							position.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-6 py-6">
						{/* --- Personal Information --- */}
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
								Personal Information
							</h3>
							<div className="grid grid-cols-3 gap-4 mb-4">
								<div className="grid gap-2">
									<Label htmlFor="firstName">
										First Name{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="firstName"
										placeholder="Alex"
										required
										value={formData.firstName}
										onChange={handleInputChange}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="middleName">
										Middle Name
									</Label>
									<Input
										id="middleName"
										placeholder="J."
										value={formData.middleName}
										onChange={handleInputChange}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="lastName">
										Last Name{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="lastName"
										placeholder="Johnson"
										required
										value={formData.lastName}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">
									Email Address{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="alex.johnson@university.edu"
									required
									value={formData.email}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						{/* --- Signer Position & Security --- */}
						<div className="border-t pt-4">
							<h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
								Role & Permissions
							</h3>

							<div className="grid gap-6">
								{/* Signer Position Tabs */}
								<div className="grid gap-3">
									<Label>
										Signer Position{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Tabs
										value={formData.signerPosition}
										onValueChange={(val) =>
											handleSelectChange(
												"signerPosition",
												val,
											)
										}
										className="w-full"
									>
										<TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100/80 p-1 gap-1">
											{Object.values(SignerPosition).map(
												(pos) => (
													<TabsTrigger
														key={pos}
														value={pos}
														className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm capitalize"
													>
														{pos
															.toLowerCase()
															.replace(/_/g, " ")}
													</TabsTrigger>
												),
											)}
										</TabsList>
									</Tabs>
								</div>

								{/* Password Field */}
								<div className="grid gap-2">
									<Label htmlFor="password">
										Password{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										required
										value={formData.password}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						{/* --- Blockchain Credentials --- */}
						<div className="border-t pt-4">
							<h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
								Blockchain Credentials
							</h3>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="publicAddress">
										Public Address (Wallet)
									</Label>
									<Input
										id="publicAddress"
										placeholder="0x..."
										className="font-mono text-sm bg-gray-50"
										value={formData.publicAddress}
										onChange={handleInputChange}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="privateKey">
										Private Key
									</Label>
									<Input
										id="privateKey"
										type="password"
										placeholder="Enter private key securely"
										className="font-mono text-sm bg-gray-50"
										value={formData.privateKey}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
							disabled={mutation.isPending}
						>
							{mutation.isPending
								? "Creating..."
								: "Create Signer"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
