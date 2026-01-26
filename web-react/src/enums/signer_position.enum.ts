export const SignerPosition = {
	DEAN: "dean",
	REGISTRAR: "registrar",
	PRESIDENT: "president",
};

export type SignerPositionType =
	(typeof SignerPosition)[keyof typeof SignerPosition];
