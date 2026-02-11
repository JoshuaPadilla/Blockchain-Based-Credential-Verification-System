import type { CredentialEnumType } from "@/enums/credential_type.enum";
import type { DateRange } from "react-day-picker";
import type { BaseQuery } from "./api_base_query";

export type RecordsQuery = BaseQuery & {
	date?: DateRange;
	revoked?: boolean;
	type?: CredentialEnumType;
};
