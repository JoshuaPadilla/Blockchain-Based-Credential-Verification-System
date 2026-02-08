import axiosClient from "@/api/axios_client";
import type { CreateCredentialTypeDto } from "@/dto/create_credential_type.dto";
import type { CredentialType } from "@/types/credential_type.type";
import { create } from "zustand";

type StoreProps = {
	fetchCredentialTypes: (term?: string) => Promise<CredentialType[]>;
	createNewCredentialType: (
		form: CreateCredentialTypeDto,
	) => Promise<CredentialType>;
};

export const useCredentialTypeStore = create<StoreProps>(() => ({
	fetchCredentialTypes: async (term) => {
		// Axios params automatically handle encoding and undefined values
		const res = await axiosClient.get("credential-types", {
			params: { term },
		});
		return res.data;
	},
	createNewCredentialType: async (form) => {
		try {
			console.log(form);
			const res = await axiosClient.post("credential-types", form);

			if (res.status === 201) return res.data;
		} catch (error: any) {
			// 👇 THIS IS THE FIX
			console.error("Validation Error:", error.response?.data);
			// It will likely print something like:
			// { message: ["email must be an email", "role should not be empty"], ... }
		}
	},
}));
