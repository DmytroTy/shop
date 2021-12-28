import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuyersModule } from './buyers/buyers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersProductsModule } from './orders-products/orders-products.module';

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
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: false,
      logging: false,
    }),
    BuyersModule,
    ProductsModule,
    OrdersModule,
    OrdersProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
