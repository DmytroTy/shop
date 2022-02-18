export class MockOrderRepository {
  async save() {
    return {
      id: 1,
      customerId: '836430587',
      transactionId: 'mct8t2jy',
    };
  }

  async update() {}
}
