import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/create_user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Post()
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Delete()
  deleteAll() {
    this.authService.deleteAll();
  }
}
