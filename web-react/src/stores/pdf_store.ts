import axiosClient from "@/api/axios_client";
import type { CredentialEnumType } from "@/enums/credential_type.enum";
import { create } from "zustand";

type StoreProps = {
	getPreview: (
		studentId: string,
		credentialType: CredentialEnumType,
	) => Promise<Blob | null>;
};

export const usePdfStore = create<StoreProps>(() => ({
	getPreview: async (studentId, credentialType) => {
		const res = await axiosClient.get(
			`pdf/preview?studentId=${studentId}&credentialName=${credentialType}`,
			{
				responseType: "blob",
			},
		);

		if (res.status === 200) {
			return res.data;
		}

		return null;
	},
}));
