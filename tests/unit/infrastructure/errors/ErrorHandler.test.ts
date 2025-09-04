import { ErrorHandler } from '../../../../src/infrastructure/errors/ErrorHandler';
import {
  AuthenticationError,
  AudioError,
  NetworkError,
} from '../../../../src/infrastructure/errors/ApplicationError';
import { logger, MemoryTransport, LogLevel } from '../../../../src/infrastructure/monitoring';

describe('ErrorHandler action logging', () => {
  let memory: MemoryTransport;

  beforeEach(() => {
    memory = new MemoryTransport();
    logger.addTransport(memory);
  });

  afterEach(() => {
    logger.removeTransport(memory);
    memory.clear();
  });

  it('logs info when sign in action is executed', async () => {
    const notifier = jest.fn();
    ErrorHandler.configure({ notifier, logger: jest.fn(), reporter: jest.fn() });

    const error = new AuthenticationError();
    await ErrorHandler.handle(error, {
      showUserNotification: true,
      logError: false,
      reportError: false,
    });

    const notification = notifier.mock.calls[0][0];
    notification.actions?.[0].action();

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.INFO);
    expect(entries[0].message).toBe('Redirect to sign in');
  });

  it('logs info when audio retry action is executed', async () => {
    const notifier = jest.fn();
    ErrorHandler.configure({ notifier, logger: jest.fn(), reporter: jest.fn() });

    const error = new AudioError('Playback failed');
    await ErrorHandler.handle(error, {
      showUserNotification: true,
      logError: false,
      reportError: false,
    });

    const notification = notifier.mock.calls[0][0];
    notification.actions?.[0].action();

    const entries = memory.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(LogLevel.INFO);
    expect(entries[0].message).toBe('Retry audio playback');
  });

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
