export const SigningResultStatus = {
	SUCCESS: "SUCCESS",
	PARTIAL_SUCCESS: "PARTIAL_SUCCESS",
	FAILED: "FAILED",
} as const;

export type SigningResultStatusType =
	(typeof SigningResultStatus)[keyof typeof SigningResultStatus];
