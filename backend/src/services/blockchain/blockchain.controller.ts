import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user_role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Roles(Role.ADMIN)
@Roles(Role.SIGNER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('blockchain')
export class BlockChainController {
  constructor(private readonly blockchainService: BlockChainService) {}

  @HttpCode(HttpStatus.OK)
  @Get('details')
  getNetwork() {
    // Fallback to actual blockchain logic
    return this.blockchainService.getNetwork();
  }

  @Get('checkCount/:credId')
  checkCount(@Param('credId') credId: string) {
    this.blockchainService.checkRequireSignCount(credId);
  }
}
