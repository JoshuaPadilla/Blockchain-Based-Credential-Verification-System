import axiosClient from "@/api/axios_client";
import type { Record } from "@/types/record.type";
import type { VerificationData } from "@/types/verification_data.type";
import { create } from "zustand";

type StoreProps = {
	adminRecords: Record[];
	getRecords: () => Promise<void>;
	createRecord: (
		studentId: string,
		credentialTypeId: string,
		cutOffYear?: string,
		cutOffSemester?: number,
	) => Promise<Record>;
	getRecord: (recordId: string) => Promise<Record>;
	verifyRecord: (credentialRef: string) => Promise<VerificationData | null>;
	signerPendingRecords: Record[];
	getSignerRecordsToSign: () => Promise<void>;
	revokeRecord: (credentialRef: string) => Promise<void>;
};

export const useRecordStore = create<StoreProps>((set) => ({
	adminRecords: [],
	signerPendingRecords: [],
	getRecords: async () => {
		try {
			const res = await axiosClient.get("record");

			console.log(res.statusText);
			if (res.status === 200) {
				set({ adminRecords: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
	createRecord: async (
		studentId,
		credentialTypeId,
		cutOffYear,
		cutOffSemester,
	) => {
		console.log(cutOffYear, cutOffSemester);
		const res = await axiosClient.post("record", {
			studentId: studentId,
			credentialTypeId: credentialTypeId,
		});

		if (res.status === 201) return res.data;
	},
	getRecord: async (recordId) => {
		console.log("Record:", recordId);
		try {
			const res = await axiosClient.get(`record/${recordId}`);

			if (res.status === 200) return res.data;
		} catch (error) {
			console.log(error);
		}
	},
	verifyRecord: async (credentialRef) => {
		const res = await axiosClient.get(
			`verification/verify/${credentialRef}`,
		);

		console.log(res.data);

		if (res.status === 200) return res.data;

		return null;
	},
	getSignerRecordsToSign: async () => {
		try {
			const res = await axiosClient.get(`record/signer-records-to-sign`);

			if (res.status === 200) {
				set({ signerPendingRecords: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
	revokeRecord: async (credentialRef) => {
		try {
			const res = await axiosClient.post(`admin/revoke/${credentialRef}`);

			if (res.status !== 200) throw new Error("failed revoking request");
		} catch (error) {
			console.log(error);
		}
	},
}));
