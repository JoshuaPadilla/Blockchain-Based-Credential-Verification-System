import axiosClient from "@/api/axios_client";
import type { Record } from "@/types/record.type";
import { create } from "zustand";

type StoreProps = {
	records: Record[];
	getRecords: () => Promise<void>;
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
}));
