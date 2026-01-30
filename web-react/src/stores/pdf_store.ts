import axiosClient from "@/api/axios_client";
import { create } from "zustand";

type StoreProps = {
	getPreview: () => Promise<Blob>;
};

export const usePdfStore = create<StoreProps>((set) => ({
	getPreview: async () => {
		const res = await axiosClient.get("pdf/preview", {
			params: { id: "3ec3ec32-0860-4ba3-889b-6d9f50886dab" },
			responseType: "blob",
		});

		return res.data;
	},
}));
