import { Controller, Get } from "@nestjs/common";
import { InsightsService } from "./insights.service";

@Controller("insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get("dashboard-insights")
  getDashboardInsights() {
    return this.insightsService.getDashboardInsights();
  }
}
