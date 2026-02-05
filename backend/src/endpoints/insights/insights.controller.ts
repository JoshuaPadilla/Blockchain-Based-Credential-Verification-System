import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Roles(Role.ADMIN)
  @Get("admin-dashboard-insights")
  getAdminDashboardInsights() {
    return this.insightsService.getAdminDashboardInsights();
  }

  @Roles(Role.SIGNER)
  @Get("signer-dashboard-insights")
  @HttpCode(HttpStatus.OK)
  getSignerDashboardInsights(@Request() req) {
    return this.insightsService.getSignerDashboardInsights(req.user.id);
  }

  @Roles(Role.SIGNER)
  @Get("signer-history-insights")
  @HttpCode(HttpStatus.OK)
  getSignerHistoryInsights(@Request() req) {
    return this.insightsService.getSignerHistoryInsights(req.user.id);
  }
}
