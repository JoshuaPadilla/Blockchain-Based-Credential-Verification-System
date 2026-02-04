import { RecordSignature } from '../entities/record_signature.entity';
import { SigningResultStatus } from '../enums/signingRe_result_status.enum';

export type SuccessSigningResponse = {
  signatureIds: string[];
  status: SigningResultStatus;
  txHash: string;
  signedCount: number;
  rejectedCount: number;
  totalGasUsed: number;
  blocknumber: number;
  gasPrice: number;
};
