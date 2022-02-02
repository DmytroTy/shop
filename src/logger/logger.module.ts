import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerWinston } from './logger-winston.service';

@Module({
  imports: [ConfigModule],
  providers: [LoggerWinston],
  exports: [LoggerWinston],
})
export class LoggerModule {}
