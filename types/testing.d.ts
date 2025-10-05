import type { Chapter } from './chapter';

export interface RouterMock {
  push: (...args: unknown[]) => unknown;
  replace: (...args: unknown[]) => unknown;
  prefetch: (...args: unknown[]) => unknown;
  refresh: () => unknown;
  back: () => unknown;
  forward: () => unknown;
}

declare global {
  interface Window {
    __TEST_BOOKMARK_CHAPTERS__?: Chapter[];
  }

  var __NEXT_ROUTER_MOCK__: RouterMock | undefined;
}
