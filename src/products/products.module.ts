import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from '../logger/logger.module';
import { AddProductsService } from './add-products.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ConsoleModule,
    LoggerModule,
    ReviewsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AddProductsService],
  // exports: [AddProductsService],
})
export class ProductsModule {}
