import axiosClient from "@/api/axios_client";
import type { RecordSignature } from "@/types/record_signature";
import { create } from "zustand";

type StoreProps = {
	signRecord: (recordId: string) => Promise<RecordSignature>;
};

export const useSignersStore = create<StoreProps>((set) => ({
	signRecord: async (recordId) => {
		const res = await axiosClient.post(`signer/sign/${recordId}`);

		if (res.status !== 200) {
			return res.data;
		}

		return res.data as RecordSignature;
	},
}));
