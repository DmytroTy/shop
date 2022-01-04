import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { Buyer } from './buyer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyersController],
  providers: [BuyersService],
  exports: [BuyersService]
})
export class BuyersModule {}
