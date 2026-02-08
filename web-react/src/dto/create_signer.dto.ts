// Import your actual enums

import type { SignerPositionType } from "@/enums/signer_position.enum";
import type { RoleType } from "@/enums/user_role.enum";

export type CreateSignerDto = {
	firstName: string;
	lastName: string;
	middleName?: string; // Optional
	email: string;
	password: string;
	role: RoleType;
	signerPosition?: SignerPositionType; // Optional

	publicAddress?: string; // Optional
	privateKey?: string; // Optional
};
