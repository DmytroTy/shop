export class MockBraintreeGateway {
  clientToken = {
    generate: () => {
      return { clientToken: 'fake-client-token' };
    },
  };

  customer = {
    create: () => {
      return { customer: { id: '836430587' } };
    },
  };

  transaction = {
    sale: (parameters) => {
      return {
        message: 'message',
        success: parameters.paymentMethodNonce === 'valid-nonce',
        transaction: {
          id: 'mct8t2jy',
          customer: {
            id: '836430587',
          },
        },
      };
    },
  };
}
