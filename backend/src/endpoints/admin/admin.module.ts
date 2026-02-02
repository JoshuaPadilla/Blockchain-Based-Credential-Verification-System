import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { CredentialTypeEntity } from "src/common/entities/credential_type.entity";
import { Record } from "src/common/entities/record.entity";

@Module({
  imports: [
    BlockChainModule,
    TypeOrmModule.forFeature([User, CredentialTypeEntity, Record]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
