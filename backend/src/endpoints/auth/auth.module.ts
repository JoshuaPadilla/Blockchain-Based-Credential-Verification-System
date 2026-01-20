import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { CredentialTypeEntity } from "src/entities/credential_type.entity";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CredentialTypeEntity]),
    BlockChainModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
