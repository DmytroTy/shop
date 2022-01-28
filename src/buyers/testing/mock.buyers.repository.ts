import { Buyer } from "../buyer.entity";

export class MockBuyersRepository {
  async findOne({ email }): Promise<Buyer> {
    if (email === 'test@test.com')
      return Object.assign({}, {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      });

    return null;
  }

  save(createBuyerDto) {
    createBuyerDto.id = 1;
    return createBuyerDto;
  }
}