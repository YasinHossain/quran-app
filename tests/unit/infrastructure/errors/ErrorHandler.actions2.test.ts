import { NetworkError, ErrorHandler } from '../../../../src/infrastructure/errors';

describe('ErrorHandler action logging (network)', () => {
  it('executes no-op retry callback by default for network errors', async () => {
    const notifier = jest.fn();
    ErrorHandler.configure({ notifier, logger: jest.fn(), reporter: jest.fn() });

    const error = new NetworkError('Failed');
    await ErrorHandler.handle(error, {
      showUserNotification: true,
      logError: false,
      reportError: false,
    });

    const notification = notifier.mock.calls[0][0];
    expect(() => notification.actions?.[0].action()).not.toThrow();
  });

  it('uses injected retry callback for network errors', async () => {
    const notifier = jest.fn();
    const refresh = jest.fn();
    ErrorHandler.configure({
      notifier,
      logger: jest.fn(),
      reporter: jest.fn(),
      retryCallback: refresh,
    });

    const error = new NetworkError('Failed');
    await ErrorHandler.handle(error, {
      showUserNotification: true,
      logError: false,
      reportError: false,
    });

    const notification = notifier.mock.calls[0][0];
    notification.actions?.[0].action();
    expect(refresh).toHaveBeenCalled();
  });
});
