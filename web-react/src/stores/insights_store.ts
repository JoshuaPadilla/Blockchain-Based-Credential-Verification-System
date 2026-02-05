import axiosClient from "@/api/axios_client";
import type { DashboardInsights } from "@/types/dashboard_insights.type";
import type { SignerDashboardInsights } from "@/types/signer_dashboard_insights";
import type { SingerHistoryInsights } from "@/types/signer_history_insights.type";
import { create } from "zustand";

type StoreProps = {
	adminDashboardInsights: DashboardInsights | null;
	signerDashboardInsights: SignerDashboardInsights | null;
	signerHistoryInsights: SingerHistoryInsights | null;

	getAdminDashboardInsights: () => Promise<void>;
	getSingerDashboardInsights: () => Promise<void>;
	getSignerHistoryInsights: () => Promise<void>;
};

export const useInsightsStore = create<StoreProps>((set) => ({
	adminDashboardInsights: null,
	signerDashboardInsights: null,
	signerHistoryInsights: null,

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
	getSingerDashboardInsights: async () => {
		try {
			const res = await axiosClient.get(
				`insights/signer-dashboard-insights`,
			);

			if (res.status === 200) {
				set({ signerDashboardInsights: res.data });
			}
		} catch (error) {
			console.log(error);
		}
	},
	getSignerHistoryInsights: async () => {
		const res = await axiosClient.get("insights/signer-history-insights");

		if (res.status !== 200)
			throw new Error("failed to fetch signer history insights");

		set({ signerHistoryInsights: res.data });
	},
}));
