import type { RecordSignature } from "./record_signature";

export type SingerHistoryInsights = {
	totalSigned: number;
	lastSignedDate: Date | null;
	successRate: number;
	recordSignatures: RecordSignature[];
};
