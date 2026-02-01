import type { VerificationStatusType } from "@/enums/verification_status.enum";
import type { Record } from "./record.type";

export type VerificationData = {
	statuses: VerificationStatusType[];
	record: Record;
};
