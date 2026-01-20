'use client';

import { NavigationCardGrid } from './NavigationCardGrid';

/**
 * Loading state for the surah grid
 * Renders skeleton cards to prevent layout shift
 */
export function SurahLoadingGrid(): React.JSX.Element {
  return (
    <NavigationCardGrid className="pb-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[84px] items-center justify-between rounded-lg border border-border bg-surface p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-border/20" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-border/20" />
              <div className="h-3 w-16 rounded bg-border/20" />
            </div>
          </div>
          <div className="h-6 w-12 rounded bg-border/20" />
        </div>
      ))}
    </NavigationCardGrid>
  );
}
