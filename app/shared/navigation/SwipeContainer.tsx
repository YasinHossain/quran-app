'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

import { useSwipeNavigation } from './hooks/useSwipeNavigation';

interface SwipeContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SwipeContainer = ({ children, className }: SwipeContainerProps): JSX.Element => {
  const swipeGestures = useSwipeNavigation();

  return (
    <div {...swipeGestures} className={cn('touch-pan-y select-none touch-callout-none', className)}>
      {children}
    </div>
  );
};
