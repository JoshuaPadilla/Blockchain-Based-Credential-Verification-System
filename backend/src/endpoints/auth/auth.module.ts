import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "src/common/strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/configs/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "src/common/strategies/jwt.strategy";
import { RefreshJwtStrategy } from "src/common/strategies/refresh_jwt.strategy";
import refresh_jwtConfig from "src/configs/refresh_jwt.config";

@Module({
  imports: [
    BlockChainModule,
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refresh_jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
