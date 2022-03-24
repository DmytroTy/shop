import { Product } from "../product.entity";

export class MockProductRepository {
  async findOne(): Promise<Product> {
    return {
      id: 1,
      categories: [{ id: 1, name: 'category' }],
      type: 'hat',
      color: 'red',
      price: 12.3,
      quantity: 8,
    };
  }
}
