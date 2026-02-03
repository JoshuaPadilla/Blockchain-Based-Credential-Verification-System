import axiosClient from "@/api/axios_client";
import type { DashboardInsights } from "@/types/dashboard_insights.type";
import type { SignerDashboardInsights } from "@/types/signer_dashboard_insights";
import { create } from "zustand";

type StoreProps = {
	adminDashboardInsights: DashboardInsights | null;
	signerDashboardInsights: SignerDashboardInsights | null;

	getAdminDashboardInsights: () => Promise<void>;
	getSingerDashboardInsights: (signerId: string) => Promise<void>;
};

export const useInsightsStore = create<StoreProps>((set) => ({
	adminDashboardInsights: null,
	signerDashboardInsights: null,

	getAdminDashboardInsights: async () => {
		try {
			const res = await axiosClient.get(
				"insights/admin-dashboard-insights",
			);

			if (res.status === 200) {
				set({ adminDashboardInsights: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSingerDashboardInsights: async (signerId) => {
		try {
			const res = await axiosClient.get(
				`insights/signer-dashboard-insights/${signerId}`,
			);

			if (res.status === 200) {
				set({ signerDashboardInsights: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
}));
