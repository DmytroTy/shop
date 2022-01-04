import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { BuyersModule } from '../buyers/buyers.module';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [BuyersModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
