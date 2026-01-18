export interface OnChainRecord {
  dataHash: string;
  expiration: bigint;
  isRevoked: boolean;
  credentialType: number;
  requiredSignatureCount: number;
  currentSignatures: number;
}
