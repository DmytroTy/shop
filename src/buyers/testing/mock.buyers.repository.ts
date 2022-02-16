import { Buyer } from "../buyer.entity";

export class MockBuyersRepository {
  async findOne(argument): Promise<Buyer> {
    if (typeof argument === 'number') {
      if (argument === 1) {
        return {
          id: 1,
          username: 'test',
          email: 'test@test.com',
          password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
        };
      }
      return null;
    }

    /* const { email, facebookId } = argument; */
    if (argument.email === 'test@test.com') {
      return Object.assign({}, {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      });
    }

    /* if (facebookId === '00000007') {
      return {
        id: 2,
        username: 'test',
        email: 'test2@test.com',
        facebookId: '00000007',
        password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
      };
    } */

    return null;
  }

  /* async update(userId, updateBuyerDto) {} */

  save(createBuyerDto) {
    createBuyerDto.id = 3;
    return createBuyerDto;
  }
}
