import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { BlockChainModule } from "src/services/blockchain/blockchain.module";

@Module({
  imports: [BlockChainModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
