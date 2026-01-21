import { Module } from "@nestjs/common";
import { SignerService } from "./signer.service";
import { SignerController } from "./signer.controller";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), BlockChainModule],
  controllers: [SignerController],
  providers: [SignerService],
})
export class SignerModule {}
