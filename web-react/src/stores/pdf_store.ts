import axiosClient from "@/api/axios_client";
import { create } from "zustand";

type StoreProps = {
	getPreview: () => Promise<Blob>;
};

export const usePdfStore = create<StoreProps>((set) => ({
	getPreview: async () => {
		const res = await axiosClient.get("pdf/preview", {
			responseType: "blob",
		});

		return res.data;
	},
}));
