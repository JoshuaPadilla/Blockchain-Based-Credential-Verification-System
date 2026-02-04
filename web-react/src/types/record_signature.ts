import type { Record } from "./record.type";
import type { User } from "./user.type";

export type RecordSignature = {
	id: string;
	txHash: string;
	signedAt: Date;
	record: Record;
	signer: User;
};
