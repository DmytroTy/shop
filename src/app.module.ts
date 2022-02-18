import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core/constants';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuyersModule } from './buyers/buyers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PaymentModule } from './payment/payment.module';
import { LoggerModule } from './logger/logger.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    BuyersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    PaymentModule,
    LoggerModule,
    ReviewsModule,
    MailModule,
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
