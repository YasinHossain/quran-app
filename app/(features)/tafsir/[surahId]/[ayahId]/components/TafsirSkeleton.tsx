import React from 'react';

/**
 * Skeleton loading component for tafsir content.
 * Displays animated placeholder lines that match the expected tafsir layout.
 */
export function TafsirSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse space-y-6" aria-hidden="true">
      {/* First paragraph skeleton (larger, like the drop cap) */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-12 w-12 rounded bg-border/30 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full rounded bg-border/30" />
            <div className="h-4 w-11/12 rounded bg-border/30" />
          </div>
        </div>
        <div className="h-4 w-full rounded bg-border/30" />
        <div className="h-4 w-10/12 rounded bg-border/30" />
        <div className="h-4 w-11/12 rounded bg-border/30" />
      </div>

      {/* Second paragraph skeleton */}
      <div className="space-y-3 pl-6">
        <div className="h-4 w-full rounded bg-border/25" />
        <div className="h-4 w-11/12 rounded bg-border/25" />
        <div className="h-4 w-9/12 rounded bg-border/25" />
        <div className="h-4 w-full rounded bg-border/25" />
        <div className="h-4 w-8/12 rounded bg-border/25" />
      </div>

      {/* Third paragraph skeleton */}
      <div className="space-y-3 pl-6">
        <div className="h-4 w-10/12 rounded bg-border/20" />
        <div className="h-4 w-full rounded bg-border/20" />
        <div className="h-4 w-11/12 rounded bg-border/20" />
        <div className="h-4 w-7/12 rounded bg-border/20" />
      </div>

      {/* Arabic text skeleton (simulates embedded Arabic quotes) */}
      <div className="flex justify-center my-4">
        <div className="h-8 w-2/3 rounded-md bg-accent/10 border border-accent/20" />
      </div>

      {/* Fourth paragraph skeleton */}
      <div className="space-y-3 pl-6">
        <div className="h-4 w-full rounded bg-border/20" />
        <div className="h-4 w-9/12 rounded bg-border/20" />
        <div className="h-4 w-11/12 rounded bg-border/20" />
      </div>
    </div>
  );
}

/**
 * Compact skeleton for tab switching scenarios
 */
export function TafsirSkeletonCompact(): React.JSX.Element {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-border/30" />
        <div className="h-4 w-11/12 rounded bg-border/30" />
        <div className="h-4 w-10/12 rounded bg-border/30" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-border/25" />
        <div className="h-4 w-9/12 rounded bg-border/25" />
      </div>
    </div>
  );
}
