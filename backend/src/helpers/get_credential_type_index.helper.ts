import { CredentialType } from 'src/enums/credential_type.enum';

export function getCredentialTypeIndex(type: CredentialType): number {
  const mapping: Record<string, number> = {
    [CredentialType.TOR]: 0,
    [CredentialType.DIPLOMA]: 1,
    [CredentialType.HONORABLE_DISMISSAL]: 2,
    [CredentialType.GOOD_MORAL]: 3,
    [CredentialType.CERT_OF_GRADES]: 4, // Matches 'CERT_GRADES' in Solidity
    [CredentialType.CERT_OF_ENROLLMENT]: 5,
    [CredentialType.UNITS_EARNED]: 6,
    [CredentialType.GWA]: 7,
    [CredentialType.LIST_OF_GRADES]: 8,
    [CredentialType.CAV]: 9,
  };

  const index = mapping[type];

  if (index === undefined) {
    throw new Error(`Invalid Credential Type: ${type}`);
  }

  return index;
}
