import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CreateCredentialTypeDto } from "src/common/dto/create_credential_type.dto";
import { CredentialTypesService } from "./credentials.service";

@Controller("credential-types") // Base route: /credential-types
export class CredentialTypesController {
  constructor(private readonly credentialsService: CredentialTypesService) {}

  // POST /credential-types
  @Post()
  create(@Body() createDto: CreateCredentialTypeDto) {
    return this.credentialsService.createCreadentialType(createDto);
  }

  // GET /credential-types
  @Get()
  findAll() {
    return this.credentialsService.findAll();
  }

  // GET /credential-types/by-name/:name
  // Specific route for finding by name (Enum value)
  @Get("by-name/:name")
  findByName(@Param("name") name: string) {
    return this.credentialsService.findByName(name);
  }

  // GET /credential-types/:id
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.credentialsService.findOne(id);
  }

  // PATCH /credential-types/:id
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDto: Partial<CreateCredentialTypeDto>,
  ) {
    return this.credentialsService.update(id, updateDto);
  }

  // DELETE /credential-types/:id
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.credentialsService.remove(id);
  }
}
