import axiosClient from "@/api/axios_client";
import type { Student } from "@/types/student.type";
import { create } from "zustand";

type StoreProps = {
	fetchStudent: (query: string) => Promise<Student[]>;
};

export const useStudentStore = create<StoreProps>(() => ({
	fetchStudent: async (query) => {
		const res = await axiosClient.get(`student?q=${query}`);

		if (res.status === 200) {
			return res.data;
		}
	},
}));
