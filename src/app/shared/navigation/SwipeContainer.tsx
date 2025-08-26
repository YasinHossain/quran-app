'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSwipeGestures } from '@/presentation/shared/hooks/useSwipeGestures';
import { cn } from '@/lib/utils';

interface SwipeContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Navigation routes in order for swipe navigation
const MAIN_ROUTES = ['/home', '/surah', '/bookmarks'];

const SwipeContainer: React.FC<SwipeContainerProps> = ({ children, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Find current route index
  const currentRouteIndex = MAIN_ROUTES.findIndex(
    (route) => pathname.startsWith(route) || (route === '/home' && pathname === '/')
  );

  const navigateToRoute = (direction: 'left' | 'right') => {
    if (currentRouteIndex === -1) return;

    let newIndex;
    if (direction === 'left') {
      // Swipe left = next route
      newIndex = (currentRouteIndex + 1) % MAIN_ROUTES.length;
    } else {
      // Swipe right = previous route
      newIndex = (currentRouteIndex - 1 + MAIN_ROUTES.length) % MAIN_ROUTES.length;
    }

    const newRoute = MAIN_ROUTES[newIndex];
    router.push(newRoute);
  };

  const swipeGestures = useSwipeGestures({
    onSwipeLeft: () => navigateToRoute('left'),
    onSwipeRight: () => navigateToRoute('right'),
    threshold: 75,
    velocity: 0.4,
  });

  return (
    <div {...swipeGestures} className={cn('touch-pan-y select-none touch-callout-none', className)}>
      {children}
    </div>
  );
};

export default SwipeContainer;
