import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import abi from '../../lib/contract.abi.json';
import { Record } from 'src/entities/record.entity';
import { getCredentialTypeIndex } from 'src/helpers/get_credential_type_index.helper';
import { OnChainRecord } from 'src/interfaces/onchain_record.interface';
import { EMPTY_BYTES } from 'src/constants/empty_bytes.constant';
import { CredentialType } from 'src/enums/credential_type.enum';

@Injectable()
export class BlockChainService {
  private provider: ethers.JsonRpcProvider;
  private ownerWallet: ethers.Wallet;
  private ownerContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpc_url = this.configService.get<string>('RPC_URL') || '';
    const private_key = this.configService.get<string>('PRIVATE_KEY') || '';
    const contract_address =
      this.configService.get<string>('CONTRACT_ADDRESS') || '';

    this.provider = new ethers.JsonRpcProvider(rpc_url);
    this.ownerWallet = new ethers.Wallet(private_key, this.provider);
    this.ownerContract = new ethers.Contract(
      contract_address,
      abi.abi,
      this.ownerWallet,
    );
  }

  addRecord(record: Record) {
    const { id, dataHash, expiration, credentialType } = record;

    // convert the credential type to its index
    const credentialTypeIndex = getCredentialTypeIndex(credentialType);

    return this.ownerContract.addRecord(
      id,
      dataHash,
      expiration,
      credentialTypeIndex,
    );
  }

  revokeRecord(recordId: string) {
    return this.ownerContract.revokeRecord(recordId);
  }

  restoreRecord(recordId: string) {
    return this.ownerContract.restoreRecord(recordId);
  }

  async verify(recordId: string) {
    const record = await this.ownerContract.records(recordId);

    if (record.hash === EMPTY_BYTES) {
      throw new NotFoundException('Record does not exist on the blockchain');
    }

    const isFullySigned = await this.ownerContract.isFullySigned(recordId);

    console.log('Is fully signed:', isFullySigned);
    // Destructure the fields and convert the BigInt
    return {
      dataHash: record.dataHash,
      expiration: record.expiration.toString(), // Convert BigInt to String
      isRevoked: record.isRevoked,
      credentialType: record.credentialType,
    } as OnChainRecord; // mapping getter
  }

  async setRequiredSigners(credentialType: number, addresses: string[]) {
    await this.ownerContract.setRequiredSigners(credentialType, addresses);
  }
  // async isFullySigned(recordId: string) {
  //   const isFullySigned = await this.ownerContract.records(recordId);
  //   console.log(isFullySigned);
  // }
}
