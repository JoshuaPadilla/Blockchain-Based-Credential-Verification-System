export interface OnChainRecord {
  dataHash: string;
  expiration: bigint;
  isRevoked: boolean;
  credentialTypeId: string;
  currentSignatures: number;
}
