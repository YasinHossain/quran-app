import type { RouterMock } from '@/types/testing';

const routerMock: RouterMock | undefined = globalThis.__NEXT_ROUTER_MOCK__;

if (!routerMock) {
  throw new Error(
    'Next router mock is not initialized. Ensure tests/setup/setupTests.ts runs before importing mockRouter.'
  );
}

export const push = routerMock.push;
export const replace = routerMock.replace;
export const prefetch = routerMock.prefetch;
export const refresh = routerMock.refresh;
export const back = routerMock.back;
export const forward = routerMock.forward;

export const mockRouter = routerMock;
