import { create } from "zustand";

type StoreProps = {
	user: boolean;
};

export const useAuthStore = create<StoreProps>((set) => ({
	user: true,
}));
