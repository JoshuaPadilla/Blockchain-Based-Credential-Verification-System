import type { SigningResultStatusType } from "@/enums/signing_result_status";

export type SigningResponse = {
	signatureIds: string[];
	status: SigningResultStatusType;
	txHash: string;
	signedCount: number;
	rejectedCount: number;
	totalGasUsed: number;
	blocknumber: number;
	gasPrice: number;
};
