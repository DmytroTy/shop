import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity';
import { BuyersController } from './buyers.controller';
import { BuyersResolver } from './buyers.resolver';
import { BuyersService } from './buyers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyersController],
  providers: [BuyersService, BuyersResolver],
  exports: [BuyersService]
})
export class BuyersModule {}
