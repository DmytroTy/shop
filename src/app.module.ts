import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyers/buyer.entity';
import { Order } from './orders/order.entity';
import { OrderProduct } from './orders_products/order_product.entity';
import { Product } from './products/product.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 15432,
      username: 'user',
      password: '**password**',
      database: 'shop',
      entities: [Buyer, Order, OrderProduct, Product], //["**/*.entity{.ts,.js}"]
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
