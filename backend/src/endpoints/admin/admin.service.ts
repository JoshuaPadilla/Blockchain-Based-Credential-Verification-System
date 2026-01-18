import { Injectable } from "@nestjs/common";
import { CredentialType } from "src/enums/credential_type.enum";
import { getCredentialTypeIndex } from "src/helpers/get_credential_type_index.helper";
import { BlockChainService } from "src/services/blockchain/blockchain.service";

@Injectable()
export class AdminService {
  constructor(private readonly blockchainService: BlockChainService) {}

  async setRequiredSigners(
    credentialType: CredentialType,
    addresses: string[],
  ) {
    const credentialTypeIndex = getCredentialTypeIndex(credentialType);
    await this.blockchainService.setRequiredSigners(
      credentialTypeIndex,
      addresses,
    );
  }
}
