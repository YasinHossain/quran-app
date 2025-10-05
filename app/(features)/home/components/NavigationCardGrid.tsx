'use client';

import { memo } from 'react';

import { cn } from '@/lib/utils/cn';

interface NavigationCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationCardGrid = memo(function NavigationCardGrid({
  children,
  className,
}: NavigationCardGridProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
});
