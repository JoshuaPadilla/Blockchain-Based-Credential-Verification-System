import type { CredentialType } from "./credential_type.type";
import type { RecordSignature } from "./record_signature";
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
	signatures: RecordSignature[];
	credentialRef: string;
	createdAt: Date;
};
