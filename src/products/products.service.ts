import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ select: ["id", "type", "color", "price", "quantity"] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id, { select: ["id", "type", "color", "price", "quantity"] });

    if (!product) throw new NotFoundException();

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.productsRepository.softDelete(id);
  }
}
