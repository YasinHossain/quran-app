import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
// Provide Fetch/Response in JSDOM via whatwg-fetch so MSW interceptors work consistently
import 'whatwg-fetch';
// Polyfills for environment features used in tests
import '@tests/envPolyfills';
import '@tests/setup/browserMocks';

import { jest, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { logger } from '@/src/infrastructure/monitoring/Logger';
import { server } from '@tests/setup/msw/server';

import type { RouterMock } from '@/types/testing';

const routerPushMock = jest.fn();
const routerReplaceMock = jest.fn();
const routerPrefetchMock = jest.fn();
const routerRefreshMock = jest.fn();
const routerBackMock = jest.fn();
const routerForwardMock = jest.fn();

const routerMock: RouterMock = {
  push: routerPushMock,
  replace: routerReplaceMock,
  prefetch: routerPrefetchMock,
  refresh: routerRefreshMock,
  back: routerBackMock,
  forward: routerForwardMock,
};

globalThis.__NEXT_ROUTER_MOCK__ = routerMock;

const useRouterMock = jest.fn();
const usePathnameMock = jest.fn();
const useSearchParamsMock = jest.fn();
const useParamsMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: useRouterMock,
  usePathname: usePathnameMock,
  useSearchParams: useSearchParamsMock,
  useParams: useParamsMock,
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

beforeEach(() => {
  useRouterMock.mockReturnValue(routerMock);
  usePathnameMock.mockReturnValue('/');
  useSearchParamsMock.mockReturnValue(new URLSearchParams());
  useParamsMock.mockReturnValue({});

  routerPushMock.mockClear();
  routerReplaceMock.mockClear();
  routerPrefetchMock.mockClear();
  routerRefreshMock.mockClear();
  routerBackMock.mockClear();
  routerForwardMock.mockClear();

  if (typeof window !== 'undefined') {
    delete window.__TEST_BOOKMARK_CHAPTERS__;
  }
});
// Start MSW for tests unless explicitly disabled.
// Set JEST_ALLOW_NETWORK=1 to bypass MSW and allow real network requests.
// Tests needing custom network responses should use `server.use` to add handlers.
if (!process.env['JEST_ALLOW_NETWORK']) {
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
