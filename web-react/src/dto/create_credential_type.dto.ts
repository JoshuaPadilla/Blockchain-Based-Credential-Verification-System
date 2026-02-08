import type { CredentialEnumType } from "@/enums/credential_type.enum";

export type CreateCredentialTypeDto = {
	name: CredentialEnumType;
	requiredSignaturesCount: number;
	signerIds: string[];
};
