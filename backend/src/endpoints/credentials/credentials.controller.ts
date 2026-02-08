import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CreateCredentialTypeDto } from "src/common/dto/create_credential_type.dto";
import { CredentialTypesService } from "./credentials.service";

@Controller("credential-types") // Base route: /credential-types
export class CredentialTypesController {
  constructor(private readonly credentialsService: CredentialTypesService) {}

  // POST /credential-types
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createDto: CreateCredentialTypeDto) {
    console.log(createDto);
    return this.credentialsService.createCreadentialType(createDto);
    1;
  }

  // GET /credential-types
  @Get()
  findAll(@Query("term") term: string) {
    return this.credentialsService.findAll(term);
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

  @Patch("remove-signers/:id")
  removeSigners(@Param("id") id: string, @Body() body: { signersId: string }) {
    return this.credentialsService.removeSigners(id, body.signersId);
  }

  // DELETE /credential-types/:id
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.credentialsService.remove(id);
  }
}
