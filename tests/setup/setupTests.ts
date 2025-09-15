import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import 'whatwg-fetch';
import '@tests/envPolyfills';
import '@tests/setup/polyfills';

import { jest, beforeAll, afterEach, afterAll, beforeEach } from '@jest/globals';
import { server } from '@tests/setup/msw/server';

import { logger } from '@/src/infrastructure/monitoring/Logger';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

declare global {
  interface HTMLMediaElement {
    simulateEvent(eventType: string): void;
    simulateTimeUpdate(time: number): void;
    simulateLoadedData(duration?: number): void;
    simulatePlay(): void;
    simulatePause(): void;
    simulateEnd(): void;
  }
}

if (!process.env.JEST_ALLOW_NETWORK) {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

beforeEach(() => {
  jest.spyOn(logger, 'error').mockImplementation(() => {});
});
