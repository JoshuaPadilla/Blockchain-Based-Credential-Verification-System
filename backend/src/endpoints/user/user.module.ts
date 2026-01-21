import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), BlockChainModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
