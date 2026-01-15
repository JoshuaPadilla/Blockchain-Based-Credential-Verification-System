import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import abi from '../../lib/contract.abi.json';
import { Record } from 'src/entities/record.entity';
import { getCredentialTypeIndex } from 'src/helpers/get_credential_type_index.helper';
import { OnChainRecord } from 'src/interfaces/onchain_record.interface';

@Injectable()
export class BlockChainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpc_url = this.configService.get<string>('RPC_URL') || '';
    const private_key = this.configService.get<string>('PRIVATE_KEY') || '';
    const contract_address =
      this.configService.get<string>('CONTRACT_ADDRESS') || '';

    this.provider = new ethers.JsonRpcProvider(rpc_url);
    this.wallet = new ethers.Wallet(private_key, this.provider);
    this.contract = new ethers.Contract(contract_address, abi.abi, this.wallet);
  }

  addRecord(record: Record) {
    const { id, dataHash, expiration, credentialType } = record;

    // convert the credential type to its index
    const credentialTypeIndex = getCredentialTypeIndex(credentialType);

    return this.contract.addRecord(
      id,
      dataHash,
      expiration,
      credentialTypeIndex,
    );
  }

  revokeRecord(recordId: string) {
    return this.contract.revokeRecord(recordId);
  }

  restoreRecord(recordId: string) {
    return this.contract.restoreRecord(recordId);
  }

  async getRecord(recordId: string) {
    const record = await this.contract.records(recordId);

    // Destructure the fields and convert the BigInt
    return {
      dataHash: record.dataHash,
      expiration: record.expiration.toString(), // Convert BigInt to String
      isRevoked: record.isRevoked,
      credentialType: record.credentialType,
    } as OnChainRecord; // mapping getter
  }
}
