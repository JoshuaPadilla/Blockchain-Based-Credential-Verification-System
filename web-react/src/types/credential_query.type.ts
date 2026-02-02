import type { DateRange } from "react-day-picker";
import type { BaseQuery } from "./api_base_query";
import type { CredentialType } from "./credential_type.type";

export type CredentialsQuery = BaseQuery & {
	date: DateRange;
	revoked: boolean;
	type: CredentialType;
};
