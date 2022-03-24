import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { LoggerWinston } from '../logger/logger-winston.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: LoggerWinston,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(createProductDto);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id, { relations: ['categories'] });

    if (!product) {
      this.logger.warn(`User error: Product with id = ${id} not found.`, 'ProductsService');
      throw new NotFoundException();
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.productsRepository.softDelete(id);
  }
}
