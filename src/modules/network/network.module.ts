import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkService } from './network.service';
import { Network } from './entities/network.entity';
import { NetworkController } from './network.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Network])],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
