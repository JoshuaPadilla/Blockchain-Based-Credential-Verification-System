import type { Record } from "./record.type";
import type { UserProfile } from "./user_profile.type";

export type RecordSignature = {
	id: string;
	txHash: string;
	signedAt: Date;
	record: Record;
	signer: UserProfile;
	blockNumber: number;
	totalGasUsed: number;
	gasUsed: number;
};
