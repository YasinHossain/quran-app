import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';
// Polyfills for environment features used in tests
import '@tests/envPolyfills';
import '@tests/setup/browserMocks';

import { jest, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';
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

// Start MSW for tests unless explicitly disabled.
// Set JEST_ALLOW_NETWORK=1 to bypass MSW and allow real network requests.
// Tests needing custom network responses should use `server.use` to add handlers.
if (!process.env.JEST_ALLOW_NETWORK) {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

// Ensure logger.error is spied before each test so individual tests
// can inspect or restore it. Jest's `restoreMocks` setting resets
// spies after every test, therefore we re-apply the spy in a
// `beforeEach` hook instead of relying on a persistent spy that would
// break when restored.
beforeEach(() => {
  jest.spyOn(logger, 'error').mockImplementation(() => {});
});
