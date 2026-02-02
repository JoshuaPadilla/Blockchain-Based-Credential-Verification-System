import axiosClient from "@/api/axios_client";
import type { CredentialType } from "@/types/credential_type.type";
import { create } from "zustand";

type StoreProps = {
	fetchCredentialTypes: () => Promise<CredentialType[]>;
};

export const useCredentialTypeStore = create<StoreProps>(() => ({
	fetchCredentialTypes: async () => {
		const res = await axiosClient.get("credential-types");

		if (res.status === 200) return res.data;
	},
}));
