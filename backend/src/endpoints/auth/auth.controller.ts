import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/common/dto/create_user.dto";
import { LocalAuthGuard } from "src/common/guards/local-auth.guard";
import { RefreshAuthGuard } from "src/common/guards/refresh-auth.guard";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    // 1. Get tokens from service (don't return them to user yet)
    const { token, refreshToken, user } = await this.authService.login(
      req.user,
    );

    // 2. Set Access Token Cookie (Short lived, e.g., 15m)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { id: user.id, role: user.role };
  }

  @UseGuards(RefreshAuthGuard)
  @Get("check-auth")
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, role, token } = await this.authService.refreshToken(req.user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1000,
    });

    return { id, role };
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return { message: "Logged out" };
  }
}
