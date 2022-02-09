export class MockMailService {
  async sendUserNotification() {
    return 1;
  }

  async sendUserErrorNotification() {
    return 1;
  }
}