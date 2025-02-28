import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ConfigModule } from '@nestjs/config';
import { IndyService } from './services/indy.service';
import { EthereumService } from './services/ethereum.service';
import { FabricService } from './services/fabric.service';

@Module({
  imports: [ConfigModule],
  providers: [
    BlockchainService,
    IndyService,
    EthereumService,
    FabricService,
  ],
  exports: [BlockchainService],
})
export class BlockchainModule {}
