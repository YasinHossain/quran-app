import type { ILoggerTransport } from './types';

export const addTransport = (transports: ILoggerTransport[], transport: ILoggerTransport): void => {
  transports.push(transport);
};

export const removeTransport = (
  transports: ILoggerTransport[],
  transport: ILoggerTransport
): void => {
  const index = transports.indexOf(transport);
  if (index > -1) {
    transports.splice(index, 1);
  }
};

export const flush = async (transports: ILoggerTransport[]): Promise<void> => {
  const flushPromises = transports.map((t) => t.flush?.()).filter(Boolean);
  await Promise.allSettled(flushPromises);
};

export const destroy = async (transports: ILoggerTransport[]): Promise<void> => {
  await flush(transports);
  await Promise.allSettled(transports.map((t) => t.destroy?.()));
};
