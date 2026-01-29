'use client';

import { memo } from 'react';

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-6 space-y-6">
        <div className="h-8 w-56 rounded bg-surface-navigation/60 motion-reduce:animate-none animate-pulse" />

        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/30 bg-surface-navigation/50 p-4"
            >
              <div className="h-5 w-20 rounded bg-interactive motion-reduce:animate-none animate-pulse" />
              <div className="mt-4 h-7 w-full rounded bg-interactive motion-reduce:animate-none animate-pulse" />
              <div className="mt-2 h-7 w-11/12 rounded bg-interactive motion-reduce:animate-none animate-pulse" />
              <div className="mt-4 h-4 w-10/12 rounded bg-interactive motion-reduce:animate-none animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(LoadingSkeleton);

