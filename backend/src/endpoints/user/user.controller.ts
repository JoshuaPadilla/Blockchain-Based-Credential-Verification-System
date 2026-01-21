import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums/user_role.enum";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    console.log(req.user);
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  deleteAll() {
    this.userService.deleteAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  remove(@Param("id") id: string) {
    this.userService.remove(id);
  }
}
