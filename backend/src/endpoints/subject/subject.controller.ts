import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { CreateSubjectDto } from "src/common/dto/create_subject.dto";

import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/user_role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller("subject")
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async findall() {
    return this.subjectService.findall();
  }

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSubjectDto: Partial<CreateSubjectDto>,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.subjectService.findOne(id);
  }
}
