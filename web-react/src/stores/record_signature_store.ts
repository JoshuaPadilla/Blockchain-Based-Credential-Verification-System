import axiosClient from "@/api/axios_client";
import type { RecordSignature } from "@/types/record_signature";
import { create } from "zustand";

type StoreProps = {
	getRecordSignature: (signatureId: string) => Promise<RecordSignature>;
};

export const useRecordSignatureStore = create<StoreProps>(() => ({
	getRecordSignature: async (signatureId) => {
		const res = await axiosClient.get(`record-signature/${signatureId}`);

		if (res.status !== 200) {
			throw new Error("failed to fetch record signature");
		}

		return res.data as RecordSignature;
	},
}));
