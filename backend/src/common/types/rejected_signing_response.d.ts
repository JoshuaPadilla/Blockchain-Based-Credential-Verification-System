import { RecordSignature } from '../entities/record_signature.entity';
import { SigningResultStatus } from '../enums/signing_result_status';

export type RejectedSigningResponse = {
  status: SigningResultStatus;
  txHash?: string;
  message?: string;
  rejectedIds: string[];
};
