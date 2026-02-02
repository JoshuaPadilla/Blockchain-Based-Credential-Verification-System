import axiosClient from "@/api/axios_client";
import type { User } from "@/types/user.type";
import type { UserProfile } from "@/types/user_profile.type";
import { create } from "zustand";

type StoreProps = {
	user: User | null;
	userProfile: UserProfile | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	getProfile: () => Promise<void>;
};

export const useAuthStore = create<StoreProps>((set, get) => ({
	user: null,
	userProfile: null,
	isLoading: false,
	login: async (email, password) => {
		try {
			const res = await axiosClient.post("auth/login", {
				email,
				password,
			});
			set({ user: res.data });
			// Fetch profile immediately after setting user
			await get().getProfile();
		} catch (error) {
			set({ user: null, userProfile: null });
			throw error; // Re-throw so the UI can show an error message
		}
	},

	logout: async () => {
		try {
			set({ isLoading: true });
			await axiosClient.post("auth/logout");
		} finally {
			// Always clear local state even if the server-side logout fails
			set({ user: null, userProfile: null });
			set({ isLoading: false });
		}
	},

	checkAuth: async () => {
		try {
			const res = await axiosClient.get("auth/check-auth");
			set({ user: res.data });
			await get().getProfile();
		} catch (error) {
			set({ user: null, userProfile: null });
		}
	},

	getProfile: async () => {
		try {
			set({ isLoading: true });
			const res = await axiosClient.get("user/profile");
			set({ userProfile: res.data });
		} catch (error) {
			set({ userProfile: null });
		} finally {
			set({ isLoading: false });
		}
	},
}));
