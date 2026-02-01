// 1. The Runtime Value (The "Object")
export const VerificationStatus = {
	VALID: "verified",
	REVOKED: "revoked",
	EXPIRED: "expired",
	TAMPERED: "tampered",
	PENDING: "pending",
	NOT_FOUND: "not_found",
} as const;

// 2. The Type (Derived from the value)
export type VerificationStatusType =
	(typeof VerificationStatus)[keyof typeof VerificationStatus];
