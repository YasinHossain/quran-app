'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { startRouteProgress } from './routeProgress';

type AppRouter = ReturnType<typeof useRouter>;

/**
 * `useRouter` from `next/navigation`, but `push` and `replace` also start the top progress bar.
 * Use it for navigations the user triggers; link clicks are picked up automatically.
 */
export function useProgressRouter(): AppRouter {
  const router = useRouter();

  return useMemo<AppRouter>(
    () => ({
      ...router,
      push: (...args) => {
        startRouteProgress(args[0]);
        router.push(...args);
      },
      replace: (...args) => {
        startRouteProgress(args[0]);
        router.replace(...args);
      },
    }),
    [router]
  );
}
