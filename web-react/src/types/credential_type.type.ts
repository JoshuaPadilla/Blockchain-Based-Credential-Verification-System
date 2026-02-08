import type { CredentialEnumType } from "@/enums/credential_type.enum";
import type { UserProfile } from "./user_profile.type";

export type CredentialType = {
	id: string;
	name: CredentialEnumType;
	requiredSignaturesCount: number;
	signers: UserProfile[];
	updatedAt: Date;
};
