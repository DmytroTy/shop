export class MockPaymentsRepository {
  async findOne({ where: { buyer: { id } } }) {
    if (id > 0) {
      return Object.assign({}, {
        id: 1,
        customerId: '836430587',
        transactionId: 'mct8t2jy',
      });
    }
    return null;
  }
}
