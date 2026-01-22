import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
  BadRequestException,
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

  async addRecord(record: Record) {
    const { id: recordId, dataHash, expiration, credentialType } = record;

    try {
      const tx = await this.ownerContract.addRecord(
        recordId,
        dataHash,
        expiration,
        id(credentialType.id), // Hashing string to bytes32
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.reason || 'Failed to add record');
    }
  }

  async revokeRecord(recordId: string) {
    try {
      const tx = await this.ownerContract.revokeRecord(recordId);

      const receipt = tx.wait();
      return receipt;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.reason || 'Failed to revoke record');
    }
  }

  async restoreRecord(recordId: string) {
    try {
      const tx = await this.ownerContract.restoreRecord(recordId);

      const receipt = tx.wait();
      return receipt;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.reason || 'Failed to restore record');
    }
  }

  async verify(recordId: string) {
    try {
      const record = await this.ownerContract.records(recordId);

      if (record.dataHash === EMPTY_BYTES) {
        throw new NotFoundException('Record does not exist on the blockchain');
      }

      return {
        dataHash: record.dataHash,
        expiration: record.expiration.toString(),
        isRevoked: record.isRevoked,
        credentialTypeId: record.credentialTypeId, // Note: check your struct property name here too
        currentSignatures: record.currentSignatures,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.reason || 'Failed to verify');
    }
  }

  async isCredentialSigner(credentialTypeId: string, addresses: string) {
    try {
      const tx = await this.ownerContract.credentialTypeSigner(
        id(credentialTypeId),
        addresses,
      );

      return tx;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.reason || 'Failed to check if authorized credential signer',
      );
    }
  }

  async setCredentialTypeSigner(
    credentialTypeId: string,
    address: string,
    allowed: boolean,
  ) {
    try {
      const tx = await this.ownerContract.setCredentialTypeSigner(
        id(credentialTypeId),
        address,
        allowed,
      );

      const receipt = tx.wait();

      return receipt;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.reason || 'Failed to add credential signer',
      );
    }
  }

  async signRecord(recordId: string, signerPrivateKey: string) {
    try {
      const signerWallet = new ethers.Wallet(signerPrivateKey, this.provider);

      const contractAsSigner = this.ownerContract.connect(
        signerWallet,
      ) as ethers.Contract;

      const tx = await contractAsSigner.signRecord(recordId);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.reason || 'failed to sign record');
    }

    // Connect a new instance for this specific signer
  }

  private async AddSignToRecord(
    recordId: string,
    signerPublicAddress,
    timestamp: string,
  ) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ['signedBy'],
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

    const updatedSigners = [...record.signedBy, signer];

    record.signedBy = updatedSigners;
    record.currentSignatures++;

    await this.recordRepository.save(record);

    console.log('Record Signed');
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
