import axiosClient from "@/api/axios_client";
import type { DashboardInsights } from "@/types/dashboard_insights.type";
import { create } from "zustand";

type StoreProps = {
	dashboardInsights: DashboardInsights | null;
	getDashboardInsights: () => Promise<void>;
};

export const useInsightsStore = create<StoreProps>((set) => ({
	dashboardInsights: null,
	getDashboardInsights: async () => {
		try {
			const res = await axiosClient.get("insights/dashboard-insights");

			if (res.status === 200) {
				set({ dashboardInsights: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
}));
