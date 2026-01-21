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
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/common/dto/create_user.dto";
import { LoginDto } from "src/common/dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "src/common/guards/local-auth.guard";
import { RefreshAuthGuard } from "src/common/guards/refresh-auth.guard";

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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }
}
