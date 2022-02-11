import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConsoleService } from 'nestjs-console';
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class AddProductsService {
  constructor(
    private readonly consoleService: ConsoleService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'add_products <type> <color> <price> <quantity>',
        description: 'add quantity to exist product or create new.',
      },
      this.addProducts,
      cli,
    );
  }

  async addProducts(type: string, color: string, price: number, quantity: number): Promise<void> {
    let product = await this.productsRepository.findOne({ type, color, price, quantity });
    if (!product) {
      product = await this.productsRepository.save({ type, color, price, quantity });

      console.log(`Created new product with id = ${product.id}`);
    } else {
      product.quantity += quantity;
      await this.productsRepository.save(product);

      console.log(`Added to exist product, now total quantity = ${product.quantity}`);
    }
  };
}
