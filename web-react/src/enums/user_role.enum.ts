export const Role = {
	ADMIN: "admin",
	SIGNER: "signer",
};

export type RoleType = (typeof Role)[keyof typeof Role];
