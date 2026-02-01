import axiosClient from "@/api/axios_client";
import type { Record } from "@/types/record.type";
import type { VerificationData } from "@/types/verification_data.type";
import { create } from "zustand";

type StoreProps = {
	records: Record[];
	getRecords: () => Promise<void>;
	createRecord: (
		studentId: string,
		credentialTypeId: string,
		cutOffYear?: string,
		cutOffSemester?: number,
	) => Promise<Record>;
	getRecord: (recordId: string) => Promise<Record>;
	verifyRecord: (credentialRef: string) => Promise<VerificationData | null>;
};

export const useRecordStore = create<StoreProps>((set) => ({
	records: [],
	getRecords: async () => {
		try {
			const res = await axiosClient.get("record");

			console.log(res.statusText);
			if (res.status === 200) {
				set({ records: res.data });
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
		const res = await axiosClient.post("record", {
			studentId: studentId,
			credentialTypeId: credentialTypeId,
		});

		if (res.status === 201) return res.data;
	},
	getRecord: async (recordId) => {
		const res = await axiosClient.get(`record/${recordId}`);

		if (res.status === 200) return res.data;
	},
	verifyRecord: async (credentialRef) => {
		console.log(credentialRef);
		const res = await axiosClient.get(
			`verification/verify/${credentialRef}`,
		);

		if (res.status === 200) return res.data;

		return null;
	},
}));
