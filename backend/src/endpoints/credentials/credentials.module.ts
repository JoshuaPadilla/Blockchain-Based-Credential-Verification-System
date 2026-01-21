import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { User } from "src/common/entities/user.entity";
import { CredentialTypesController } from "./credentials.controller";
import { CredentialTypesService } from "./credentials.service";

@Module({
  imports: [TypeOrmModule.forFeature([CredentialTypeEntity, User])],
  controllers: [CredentialTypesController],
  providers: [CredentialTypesService],
})
export class CredentialTypesModule {}
