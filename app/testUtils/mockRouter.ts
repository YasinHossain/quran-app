import { jest } from '@jest/globals';

import type { RouterMock } from '@/types/testing';

const routerMock: RouterMock | undefined = globalThis.__NEXT_ROUTER_MOCK__;

if (!routerMock) {
  throw new Error(
    'Next router mock is not initialized. Ensure tests/setup/setupTests.ts runs before importing mockRouter.'
  );
}

type RouterMethodMock<K extends keyof RouterMock> = RouterMock[K] extends (
  ...args: infer Args
) => infer Return
  ? jest.Mock<Return, Args>
  : never;

const wrapRouterMethod = <K extends keyof RouterMock>(method: K): RouterMethodMock<K> => {
  const original = routerMock[method];

  if (typeof original !== 'function') {
    throw new Error(`Router mock method "${String(method)}" is not a function.`);
  }

  const originalFn = original as (
    ...args: Parameters<RouterMock[K]>
  ) => ReturnType<RouterMock[K]>;

  const spy = jest.fn((...args: Parameters<RouterMock[K]>) => originalFn(...args)) as RouterMethodMock<K>;

  routerMock[method] = spy as RouterMock[K];

  return spy;
};

export const push = wrapRouterMethod('push');
export const replace = wrapRouterMethod('replace');
export const prefetch = wrapRouterMethod('prefetch');
export const refresh = wrapRouterMethod('refresh');
export const back = wrapRouterMethod('back');
export const forward = wrapRouterMethod('forward');

export const mockRouter = routerMock as typeof routerMock & {
  push: RouterMethodMock<'push'>;
  replace: RouterMethodMock<'replace'>;
  prefetch: RouterMethodMock<'prefetch'>;
  refresh: RouterMethodMock<'refresh'>;
  back: RouterMethodMock<'back'>;
  forward: RouterMethodMock<'forward'>;
};
