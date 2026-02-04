import axiosClient from "@/api/axios_client";
import { SigningResultStatus } from "@/enums/signing_result_status";
import type { SigningResponse } from "@/types/signing_response";

import { create } from "zustand";

type StoreProps = {
	signingResultData: SigningResponse | null;
	signRecords: (recordIds: string[]) => Promise<void>;
};

export const useSignersStore = create<StoreProps>((set) => ({
	signingResultData: null,
	signRecords: async (recordIds) => {
		const res = await axiosClient.post(`signer/batch-sign`, {
			recordIds,
		});

		if (res.status !== 200) {
			throw new Error("failed to sign records");
		}

		if (res.data.status === SigningResultStatus.SUCCESS) {
			set({ signingResultData: res.data });
		} else {
			throw new Error(res.data.message || "signing failed");
		}
	},
}));
