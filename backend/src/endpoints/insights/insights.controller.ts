import { Controller, Get, Param } from "@nestjs/common";
import { InsightsService } from "./insights.service";

@Controller("insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get("admin-dashboard-insights")
  getAdminDashboardInsights() {
    return this.insightsService.getAdminDashboardInsights();
  }

  @Get("signer-dashboard-insights/:userId")
  getSignerDashboardInsights(@Param("userId") userId: string) {
    return this.insightsService.getSignerDashboardInsights(userId);
  }
}
