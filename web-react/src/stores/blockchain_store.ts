import axiosClient from "@/api/axios_client";
import type { BlockchainDetails } from "@/types/blockchain_details";
import axios from "axios";
import { create } from "zustand";

type StoreProps = {
	getBlockchainDetails: () => Promise<void>;
	blockchainDetails: BlockchainDetails | null;
};

export const useBlockchainStore = create<StoreProps>((set) => ({
	getBlockchainDetails: async () => {
		try {
			const res = await axiosClient.get("blockchain/details");

			if (res.status === 200) {
				set({ blockchainDetails: res.data });
			}

			throw new Error();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Now TypeScript knows 'error' is an AxiosError
				// You can safely access .response
				const serverMessage =
					error.response?.data?.message || "An error occurred";
				console.log("Status:", error.response?.status);
				console.log("Message:", serverMessage);
			} else {
				// This handles non-axios errors (like a code crash)
				console.error("Native Error:", error);
			}
		}
	},
	blockchainDetails: null,
}));
