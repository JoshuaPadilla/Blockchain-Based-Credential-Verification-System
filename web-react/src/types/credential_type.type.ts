import type { CredentialEnumType } from "@/enums/credential_type.enum";
import type { CredentialSigner } from "./credential_signer.type";

export type CredentialType = {
	id: string;
	name: CredentialEnumType;
	requiredSignaturesCount: number;
	signers: CredentialSigner[];
	createdAt: Date;
	updatedAt: Date;
};
