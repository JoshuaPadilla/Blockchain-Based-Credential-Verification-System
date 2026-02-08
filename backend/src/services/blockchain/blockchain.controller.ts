import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @Get()
  getNetwork() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'dev') {
      return { name: 'dev' };
    }

    // Fallback to actual blockchain logic
    return this.blockchainService.getNetwork();
  }

  @Get('checkCount/:credId')
  checkCount(@Param('credId') credId: string) {
    this.blockchainService.checkRequireSignCount(credId);
  }
}
