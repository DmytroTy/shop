import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { Order } from '../orders/order.entity';
import { MailModule } from '../mail/mail.module';
import { Product } from '../products/product.entity';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, Payment, Product]),
    LoggerModule,
    MailModule,
  ],
  providers: [PaymentService, PaymentResolver],
  controllers: [PaymentController],
})
export class PaymentModule {}
