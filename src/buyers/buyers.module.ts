import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';

@Module({
  controllers: [BuyersController],
  providers: [BuyersService]
})
export class BuyersModule {}
