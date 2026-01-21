import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { decrypt } from "src/common/helpers/encryption.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";
import { Repository } from "typeorm";

@Injectable()
export class SignerService {
  constructor(
    private readonly blockchainService: BlockChainService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signRecord(recordId: string, signerId: string) {
    const signer = await this.userRepository.findOne({
      where: { id: signerId },
      select: ["privateKey", "publicAddress"],
    });

    if (!signer) {
      throw new NotFoundException("No signer found");
    }

    const signerPrivateKey = await decrypt(signer.privateKey);
    await this.blockchainService.signRecord(recordId, signerPrivateKey);
  }
}
