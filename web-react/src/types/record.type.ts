import type { CredentialType } from "./credential_type.type";
import type { Student } from "./student.type";

export type Record = {
	id: string;
	txHash: string;
	dataHash: string;
	expiration: bigint;
	revoked: boolean;
	credentialType: CredentialType;
	currentSignatures: number;
	student: Student;
	credentialRef: string;
	createdAt: Date;
};
