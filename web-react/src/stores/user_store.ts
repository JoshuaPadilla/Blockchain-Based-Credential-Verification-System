import axiosClient from "@/api/axios_client";
import type { CreateSignerDto } from "@/dto/create_signer.dto";
import type { UserProfile } from "@/types/user_profile.type";
import { create } from "zustand";

type StoreProps = {
	signers: UserProfile[];
	getSigners: (role?: string, term?: string) => Promise<UserProfile[]>;
	createSigner: (form: CreateSignerDto) => Promise<UserProfile>;
};

export const useUserStore = create<StoreProps>(() => ({
	signers: [],
	getSigners: async (role?: string, term?: string) => {
		console.log("Fetching signers with role:", role, "and term:", term);
		try {
			const res = await axiosClient.get(
				`user?role=${role || ""}&term=${term || ""}`,
			);

			if (res.status === 200) {
				return res.data;
			}
		} catch (error) {
			console.log(error);
		}
	},
	createSigner: async (form) => {
		console.log(form);
		try {
			const res = await axiosClient.post("auth/register", form);
			if (res.status === 201) return res.data;
		} catch (error: any) {
			// 👇 THIS IS THE FIX
			console.error("Validation Error:", error.response?.data);
			// It will likely print something like:
			// { message: ["email must be an email", "role should not be empty"], ... }
		}
	},
}));
