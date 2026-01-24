import React from 'react';

export const VerseSkeleton = ({ index }: { index: number }): React.JSX.Element => (
  <div
    aria-hidden="true"
    className={`mb-0 pb-4 pt-4 md:pb-8 md:pt-6 border-b border-border animate-pulse ${
      index === 0 ? 'border-t md:border-t-0' : ''
    }`}
  >
    <div className="space-y-4 md:space-y-0 md:flex md:items-stretch md:gap-x-6">
      {/* Action buttons column skeleton */}
      <div className="hidden md:flex md:w-16 flex-col gap-3 pt-4 items-center">
        <div className="h-8 w-8 rounded bg-border/20" />
        <div className="h-8 w-8 rounded bg-border/20" />
        <div className="h-8 w-8 rounded bg-border/20" />
      </div>

      {/* Content column skeleton */}
      <div className="space-y-8 md:flex-grow py-2">
        {/* Arabic Text Skeleton */}
        <div className="flex justify-end w-full">
          <div className="h-12 w-3/4 rounded-lg bg-border/20" />
        </div>

        {/* Translation Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-11/12 rounded bg-border/20" />
          <div className="h-4 w-4/5 rounded bg-border/20" />
        </div>
      </div>
    </div>
  </div>
);
