export enum SignatureStatus {
  PENDING = 'PENDING', // We are about to send to blockchain
  SUBMITTED = 'SUBMITTED', // Sent, waiting for mining
  CONFIRMED = 'CONFIRMED', // Successfully mined
  FAILED = 'FAILED', // Blockchain rejected it
}
