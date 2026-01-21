import { CredentialType } from 'src/common/enums/credential_type.enum';

export function getCredentialTypeFromIndex(
  index: number | bigint,
): CredentialType {
  // 1. Convert BigInt to standard number (safe for enum indices)
  const numericIndex = Number(index);

  // 2. Define the mapping array (Order MUST match Solidity)
  const mapping: CredentialType[] = [
    CredentialType.TOR, // 0
    CredentialType.DIPLOMA, // 1
    CredentialType.HONORABLE_DISMISSAL, // 2
    CredentialType.GOOD_MORAL, // 3
    CredentialType.CERT_OF_GRADES, // 4
    CredentialType.CERT_OF_ENROLLMENT, // 5
    CredentialType.UNITS_EARNED, // 6
    CredentialType.GWA, // 7
    CredentialType.LIST_OF_GRADES, // 8
    CredentialType.CAV, // 9
  ];

  // 3. Retrieve the value
  const result = mapping[numericIndex];

  // 4. Validate
  if (!result) {
    throw new Error(`Unknown Credential Index from Blockchain: ${index}`);
  }

  return result;
}
