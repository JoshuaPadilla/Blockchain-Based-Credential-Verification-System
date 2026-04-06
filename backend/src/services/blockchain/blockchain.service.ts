import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers, id } from 'ethers'; // "id" is keccak256 in v6
import { EMPTY_BYTES } from 'src/common/constants/empty_bytes.constant';
import { Record } from 'src/common/entities/record.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import abi from '../../lib/contract.abi.json';

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
  }

  async addRecord(record: Record) {
    const {
      credentialRef: recordId,
      dataHash,
      expiration,
      credentialType,
    } = record;

    try {
      const tx = await this.ownerContract.addRecord(
        recordId,
        dataHash,
        expiration,
        id(credentialType.id), // Hashing string to bytes32
      );

      const receipt = await tx.wait();

      if (receipt.status !== 1)
        throw new BadRequestException('Error adding record in blockchain');
      return tx;
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
      const record = await this.ownerContract.getRecord(recordId);

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

  async isCredentialSigner(credentialTypeId: string, address: string) {
    try {
      const tx = await this.ownerContract.credentialTypeSigner(
        id(credentialTypeId),
        address,
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

      return tx;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.reason || 'Failed to add credential signer',
      );
    }
  }

  async addNewCredentialType(
    credentialTypeId: string,
    addresses: string[],
    requiredSignatureCount: number,
  ) {
    try {
      const tx = await this.ownerContract.addNewCredentialType(
        id(credentialTypeId),
        addresses,
        requiredSignatureCount,
      );

      return tx;
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

      // 1. SUBMISSION (The `tx`)
      // This happens fast (milliseconds)
      const tx = await contractAsSigner.signRecord(recordId);

      // IMPORTANT: Save this hash to DB immediately!
      // If your server crashes 1 second later, you still have the tracking number.
      console.log('Transaction Sent! Hash:', tx.hash);
      // TODO: db.update({ status: 'SUBMITTED', txHash: tx.hash })

      return tx;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.reason || 'failed to sign record');
    }

    // Connect a new instance for this specific signer
  }
  async batchSignRecords(recordIds: string[], signerPrivateKey: string) {
    try {
      const signerWallet = new ethers.Wallet(signerPrivateKey, this.provider);

      const contractAsSigner = this.ownerContract.connect(
        signerWallet,
      ) as ethers.Contract;

      // 1. SUBMISSION (The `tx`)
      // This happens fast (milliseconds)
      const tx = await contractAsSigner.batchSignRecords(recordIds);

      // IMPORTANT: Save this hash to DB immediately!
      // If your server crashes 1 second later, you still have the tracking number.
      // TODO: db.update({ status: 'SUBMITTED', txHash: tx.hash })

      return tx;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.reason || 'failed to sign record');
    }

    // Connect a new instance for this specific signer
  }

  async getNetwork() {
    const networkDetails = await this.provider.getNetwork();
    return { networkName: networkDetails.name };
  }

  async getGasEstimate() {
    const GAS_LIMIT_ESTIMATE = 200_000n;
    const feeData = await this.provider.getFeeData();
    // Prefer maxFeePerGas (EIP-1559), fall back to legacy gasPrice
    const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice;

    if (!gasPrice || gasPrice === 0n) {
      throw new BadRequestException('Unable to fetch gas price from network');
    }

    const estimatedCostWei = gasPrice * GAS_LIMIT_ESTIMATE;
    const estimatedCostEth = (Number(estimatedCostWei) / 1e18).toFixed(8);
    return {
      gasPrice: gasPrice.toString(),
      estimatedGasUnits: GAS_LIMIT_ESTIMATE.toString(),
      estimatedCostEth,
    };
  }

  async checkRequireSignCount(credentialTypeId: string) {
    try {
      const tx = await this.ownerContract.requiredSignatureCount(
        id(credentialTypeId),
      );

      console.log(tx);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.reason || 'Failed to check if authorized credential signer',
      );
    }
  }
}
