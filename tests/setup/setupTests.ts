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

const unhandledRejections: unknown[] = [];

const isErrorLike = (value: unknown): value is { name?: unknown; message?: unknown } =>
  typeof value === 'object' && value !== null;

const getErrorLabel = (value: unknown): string | null => {
  if (!isErrorLike(value)) return null;
  const name = typeof value.name === 'string' ? value.name : 'Error';
  const message = typeof value.message === 'string' ? value.message : '';
  return message ? `${name}: ${message}` : name;
};

const describeFetchTarget = (input: Parameters<typeof fetch>[0]): string => {
  if (typeof input === 'string') return input;
  if (typeof URL !== 'undefined' && input instanceof URL) return input.toString();
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return String(input);
};

const originalFetch = globalThis.fetch;
if (typeof originalFetch === 'function') {
  globalThis.fetch = ((...args: Parameters<typeof originalFetch>) => {
    const target = describeFetchTarget(args[0]);
    return originalFetch(...args).catch((error) => {
      const label = getErrorLabel(error);
      if (label?.startsWith('InvalidStateError')) {
        console.error(`[tests] fetch rejected: ${target}`, label);
      }
      throw error;
    });
  }) as typeof originalFetch;
}

process.on('unhandledRejection', (reason) => {
  const label = getErrorLabel(reason);
  if (label?.startsWith('InvalidStateError')) {
    console.error(`[tests] unhandledRejection: ${label}`);
  }
  unhandledRejections.push(reason);
});

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

// Next.js server-only request helpers (used by server components/pages).
// In unit tests we don't have a request scope, so provide lightweight mocks.
jest.mock('next/headers', () => ({
  headers: async () => new Headers(),
  cookies: async () => ({
    get: () => undefined,
    getAll: () => [],
    has: () => false,
    set: () => {},
    delete: () => {},
  }),
}));

// Optional Vercel runtime components (not needed for unit tests).
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }), {
  virtual: true,
});
jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }), { virtual: true });

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
  unhandledRejections.length = 0;
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

afterEach(() => {
  if (!unhandledRejections.length) return;
  const first = unhandledRejections[0];
  unhandledRejections.length = 0;

  if (first instanceof Error) {
    throw first;
  }

  if (first instanceof DOMException) {
    throw new Error(`Unhandled rejection: ${first.name}: ${first.message}`);
  }

  throw new Error(`Unhandled rejection: ${String(first)}`);
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

type MockUseTranslationReturn = {
  t: (key: string, options?: Record<string, unknown>) => string;
  i18n: {
    changeLanguage: jest.Mock;
    language: string;
    languages: string[];
    on: jest.Mock;
    off: jest.Mock;
    exists: jest.Mock;
    t: jest.Mock;
  };
};

const defaultUseTranslationImplementation = (): MockUseTranslationReturn => ({
  t: (key: string, options?: Record<string, unknown> | string) => {
    if (typeof options === 'string') return options;
    if (options && typeof options === 'object') {
      const defaultValue = options['defaultValue'];
      if (typeof defaultValue === 'string') return defaultValue;
    }

    return typeof key === 'string' ? key : String(key);
  },
  i18n: {
    changeLanguage: jest.fn(),
    language: 'en',
    languages: ['en'],
    on: jest.fn(),
    off: jest.fn(),
    exists: jest.fn(() => false),
    t: jest.fn((key: string) => key),
  },
});

const mockUseTranslation = jest.fn(defaultUseTranslationImplementation);

// Lightweight global mock for react-i18next to avoid heavy runtime initialization in tests
// Individual tests can override this with their own jest.mock if needed.
jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  return {
    ...actual,
    useTranslation: mockUseTranslation,
    Trans: ({ children }: { children: React.ReactNode }) =>
      children as unknown as React.ReactElement,
    initReactI18next: { type: '3rdParty', init: jest.fn() },
  };
});

type VerseCardStateStub = {
  verseRef: { current: null };
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isVerseBookmarked: boolean;
  handlePlayPause: jest.Mock;
};

const createDefaultVerseCardState = (): VerseCardStateStub => ({
  verseRef: { current: null },
  isPlaying: false,
  isLoadingAudio: false,
  isVerseBookmarked: false,
  handlePlayPause: jest.fn(),
});

const mockUseVerseCard = jest.fn(createDefaultVerseCardState);

// Stub heavy verse-card hook to avoid observer/audio side-effects in DOM tests
jest.mock('@/app/(features)/surah/components/verse-card/useVerseCard', () => ({
  useVerseCard: mockUseVerseCard,
}));

// Mock virtualizer to avoid layout-dependent measurements in JSDOM
type VirtualizerStub = {
  getVirtualItems: () => { key: string; index: number; start: number }[];
  getTotalSize: () => number;
  measureElement: jest.Mock;
  measure: jest.Mock;
  scrollToIndex: jest.Mock;
  scrollToOffset: jest.Mock;
  getScrollElement: jest.Mock;
};

const createVirtualizerStub = (count: number): VirtualizerStub => {
  const items = Array.from({ length: count }, (_, index) => ({
    key: `virtual-${index}`,
    index,
    start: index * 320,
  }));
  return {
    getVirtualItems: () => items,
    getTotalSize: () => count * 320,
    measureElement: jest.fn(),
    measure: jest.fn(),
    scrollToIndex: jest.fn(),
    scrollToOffset: jest.fn(),
    getScrollElement: jest.fn(),
  };
};

jest.mock(
  '@tanstack/react-virtual',
  () => ({
    useVirtualizer: ({ count }: { count: number }) => createVirtualizerStub(count),
    useWindowVirtualizer: ({ count }: { count: number }) => createVirtualizerStub(count),
  }),
  { virtual: true }
);

// Mock react-virtuoso to avoid relying on layout measurements in JSDOM.
jest.mock('react-virtuoso', () => {
  const React = jest.requireActual('react');
  return {
    Virtuoso: React.forwardRef(
      (
        {
          data,
          totalCount,
          itemContent,
          initialItemCount,
          computeItemKey,
        }: {
          data?: unknown[];
          totalCount?: number;
          itemContent: (index: number, item?: unknown) => React.ReactNode;
          initialItemCount?: number;
          computeItemKey?: (index: number, item?: unknown) => React.Key;
        },
        ref: React.Ref<unknown>
      ) => {
        React.useImperativeHandle(ref, () => ({
          scrollToIndex: jest.fn(),
        }));

        const count = Array.isArray(data)
          ? data.length
          : typeof totalCount === 'number'
            ? totalCount
            : 0;
        const renderCount =
          typeof initialItemCount === 'number' && initialItemCount > 0
            ? Math.min(count, initialItemCount)
            : Math.min(count, 50);

        const items = Array.from({ length: renderCount }, (_, index) => {
          const item = Array.isArray(data) ? data[index] : undefined;
          const key = computeItemKey ? computeItemKey(index, item) : index;
          return React.createElement(
            'div',
            { key, 'data-virtuoso-item': '' },
            itemContent(index, item)
          );
        });

        return React.createElement('div', { 'data-virtuoso-mock': '' }, items);
      }
    ),
  };
});

beforeEach(() => {
  mockUseTranslation.mockImplementation(defaultUseTranslationImplementation);
  mockUseVerseCard.mockImplementation(createDefaultVerseCardState);
});
