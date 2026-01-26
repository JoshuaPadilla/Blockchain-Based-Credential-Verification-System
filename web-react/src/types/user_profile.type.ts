import type { SignerPositionType } from "@/enums/signer_position.enum";
import type { RoleType } from "@/enums/user_role.enum";

export type UserProfile = {
	role: RoleType;
	firstName: string;
	middleName: string;
	lastName: string;
	signerPosition?: SignerPositionType;
};
