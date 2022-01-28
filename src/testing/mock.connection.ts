import { Order } from "../orders/order.entity";

export class MockConnection {
  createQueryRunner() {
    return {
      manager: {
        decrement: () => {},
        increment: () => {},
        update: () => {},
        save: (entity) => {
          if (entity === Order) {
            return {
              id: 1,
              customerId: '836430587',
              transactionId: 'mct8t2jy',
            };
          }
        },
      },
      connect: () => {},
      startTransaction: () => {},
      commitTransaction: () => {},
      rollbackTransaction: () => {},
      release: () => {},
    }
  }
}
