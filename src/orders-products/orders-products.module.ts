import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersProductsService } from './orders-products.service';
import { OrdersProductsController } from './orders-products.controller';
import { OrderProduct } from './order-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  controllers: [OrdersProductsController],
  providers: [OrdersProductsService]
})
export class OrdersProductsModule {}
