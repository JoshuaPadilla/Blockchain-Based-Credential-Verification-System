import axiosClient from "@/api/axios_client";
import type { BlockchainDetails } from "@/types/blockchain_details";
import type { GasEstimate } from "@/types/gas_estimate";
import axios from "axios";
import { create } from "zustand";

type StoreProps = {
	getBlockchainDetails: () => Promise<void>;
	blockchainDetails: BlockchainDetails | null;
	getGasEstimate: () => Promise<GasEstimate | null>;
	getEthPhpRate: () => Promise<number | null>;
};

export const useBlockchainStore = create<StoreProps>((set) => ({
	getBlockchainDetails: async () => {
		try {
			const res = await axiosClient.get("blockchain/details");

			if (res.status === 200) {
				set({ blockchainDetails: res.data });
				return;
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
	getGasEstimate: async () => {
		try {
			const res = await axiosClient.get("blockchain/gas-estimate");
			if (res.status === 200) return res.data as GasEstimate;
			return null;
		} catch {
			return null;
		}
	},
	getEthPhpRate: async () => {
		try {
			const res = await axios.get(
				"https://api.coingecko.com/api/v3/simple/price",
				{ params: { ids: "ethereum", vs_currencies: "php" } },
			);
			return (res.data?.ethereum?.php as number) ?? null;
		} catch {
			return null;
		}
	},
}));
