import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useSwipeGestures } from '@/app/shared/hooks/useSwipeGestures';

const MAIN_ROUTES = ['/home', '/surah', '/bookmarks'];

export function useSwipeNavigation(): ReturnType<typeof useSwipeGestures> {
  const router = useRouter();
  const pathname = usePathname();

  const currentRouteIndex = MAIN_ROUTES.findIndex(
    (route) => pathname.startsWith(route) || (route === '/home' && pathname === '/')
  );

  const navigateToRoute = useCallback(
    (direction: 'left' | 'right') => {
      if (currentRouteIndex === -1) return;

      const newIndex =
        direction === 'left'
          ? (currentRouteIndex + 1) % MAIN_ROUTES.length
          : (currentRouteIndex - 1 + MAIN_ROUTES.length) % MAIN_ROUTES.length;

      router.push(MAIN_ROUTES[newIndex]);
    },
    [currentRouteIndex, router]
  );

  return useSwipeGestures({
    onSwipeLeft: () => navigateToRoute('left'),
    onSwipeRight: () => navigateToRoute('right'),
    threshold: 75,
    velocity: 0.4,
  });
}
