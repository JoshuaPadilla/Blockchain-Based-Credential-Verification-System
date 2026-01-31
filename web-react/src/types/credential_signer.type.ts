import type { SignerPositionType } from "@/enums/signer_position.enum";

export type CredentialSigner = {
	signerPosition: SignerPositionType;
	firstName: string;
	middleName: string;
	lastName: string;
};
