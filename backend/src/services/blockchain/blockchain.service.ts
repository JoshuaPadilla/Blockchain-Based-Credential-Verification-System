import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, id } from 'ethers'; // "id" is keccak256 in v6
import abi from '../../lib/contract.abi.json';
import { Record } from 'src/common/entities/record.entity';
import { OnChainRecord } from 'src/common/interfaces/onchain_record.interface';
import { EMPTY_BYTES } from 'src/common/constants/empty_bytes.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlockChainService implements OnModuleInit {
  private readonly logger = new Logger(BlockChainService.name);
  private provider: ethers.JsonRpcProvider;
  private ownerWallet: ethers.Wallet;
  private ownerContract: ethers.Contract;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL') || '';
    const privateKey = this.configService.get<string>('PRIVATE_KEY') || '';
    const contractAddress =
      this.configService.get<string>('CONTRACT_ADDRESS') || '';

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.ownerWallet = new ethers.Wallet(privateKey, this.provider);

    // Connect the contract
    this.ownerContract = new ethers.Contract(
      contractAddress,
      abi.abi,
      this.ownerWallet,
    );

    // Start listening immediately upon initialization
    this.listenForSignatures();
  }

  addRecord(record: Record) {
    const { id: recordId, dataHash, expiration, credentialType } = record;

    return this.ownerContract.addRecord(
      recordId,
      dataHash,
      expiration,
      id(credentialType.id), // Hashing string to bytes32
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

    // FIXED: Solidity struct property is 'dataHash', not 'hash'
    if (record.dataHash === EMPTY_BYTES) {
      throw new NotFoundException('Record does not exist on the blockchain');
    }

    const isFullySigned = await this.ownerContract.isFullySigned(recordId);

    return {
      dataHash: record.dataHash,
      expiration: record.expiration.toString(),
      isRevoked: record.isRevoked,
      credentialType: record.credentialTypeId, // Note: check your struct property name here too
      isFullySigned, // Added this as it's useful
    };
  }

  async setRequiredSigners(credentialType: string, addresses: string[]) {
    // FIXED: Must hash the string to bytes32 to match Solidity
    await this.ownerContract.setRequiredSigners(id(credentialType), addresses);
  }

  async setAuthorizedSigners(address: string, allowed: boolean) {
    // FIXED: Function name is 'anvil' in your Solidity code
    await this.ownerContract.setAuthorizedSigner(address, allowed);
  }

  async signRecord(recordId: string, signerPrivateKey: string) {
    const signerWallet = new ethers.Wallet(signerPrivateKey, this.provider);

    // Connect a new instance for this specific signer
    const contractAsSigner = this.ownerContract.connect(
      signerWallet,
    ) as ethers.Contract;

    const tx = await contractAsSigner.signRecord(recordId);
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async isAuthorizedSigner(publicAddress: string) {
    return await this.ownerContract.authorizedSigners(publicAddress);
  }

  private async AddSignToRecord(
    recordId: string,
    signerPublicAddress,
    timestamp: string,
  ) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ['signers'],
    });

    const signer = await this.userRepository.findOneBy({
      publicAddress: signerPublicAddress,
    });

    if (!signer) {
      throw new NotFoundException('Signer not found');
    }

    if (!record) {
      throw new NotFoundException('No record found!');
    }

    const updatedSigners = [...record.signers, signer];

    record.signers = updatedSigners;
    record.currentSignatures++;

    await this.recordRepository.save(record);
  }

  // FIXED: Removed "function" keyword & used class properties
  listenForSignatures() {
    this.logger.log('Listening for RecordSigned events...');

    // Using the existing contract instance
    this.ownerContract.on('RecordSigned', (recordId, signer, timestamp) => {
      this.AddSignToRecord(recordId, signer, timestamp);
      // TODO: Call an internal method to update your DB status
      // e.g., this.handleSignatureEvent(recordId, signer);
    });
  }
}
