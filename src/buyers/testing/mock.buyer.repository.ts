import { Buyer } from "../buyer.entity";

export class MockBuyerRepository {
  async findOne(email: string): Promise<Buyer> {
    return {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
    };
  }

  save(createBuyerDto) {
    createBuyerDto.id = 1;
    return createBuyerDto;
  }
}
