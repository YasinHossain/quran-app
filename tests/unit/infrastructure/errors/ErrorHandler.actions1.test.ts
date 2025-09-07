import {
  AuthenticationError,
  AudioError,
  ErrorHandler,
} from '../../../../src/infrastructure/errors';
import { logger, MemoryTransport, LogLevel } from '../../../../src/infrastructure/monitoring';

describe('ErrorHandler action logging (auth/audio)', () => {
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
});
