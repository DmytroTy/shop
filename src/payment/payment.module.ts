import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/orders.module';
import { Product } from '../products/product.entity';
import { ProductsModule } from '../products/products.module';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment, Product]),
    OrdersModule,
    ProductsModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
