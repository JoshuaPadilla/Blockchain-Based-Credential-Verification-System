import type { CredentialEnumType } from "@/enums/credential_type.enum";
import type { User } from "./user.type";

export type CredentialType = {
	id: string;
	name: CredentialEnumType;
	requiredSignaturesCount: number;
	signers: User[];
	createdAt: Date;
	updatedAt: Date;
};
