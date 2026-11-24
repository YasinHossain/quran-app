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
        'grid w-full auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2.5 md:gap-y-3 xl:gap-y-4 gap-x-2.5 md:gap-x-3 xl:gap-x-4',
        className
      )}
    >
      {children}
    </div>
  );
});
