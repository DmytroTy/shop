import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuyersModule } from './buyers/buyers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersProductsModule } from './orders-products/orders-products.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    BuyersModule,
    ProductsModule,
    OrdersModule,
    OrdersProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
