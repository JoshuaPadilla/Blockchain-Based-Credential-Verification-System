export const CredentialTypeEnum = {
	TOR: "TOR",
	DIPLOMA: "DIPLOMA",
	HONORABLE_DISMISSAL: "HONORABLE_DISMISSAL",
	GOOD_MORAL: "GOOD_MORAL",
	CERT_OF_GRADES: "CERT_GRADES",
	CERT_OF_ENROLLMENT: "CERT_OF_ENROLLMENT",
	UNITS_EARNED: "UNITS_EARNED",
	GWA: "GWA",
	LIST_OF_GRADES: "LIST_OF_GRADES",
	CAV: "CAV",
} as const;

// Create a type from the POJO values
export type CredentialEnumType =
	(typeof CredentialTypeEnum)[keyof typeof CredentialTypeEnum];
