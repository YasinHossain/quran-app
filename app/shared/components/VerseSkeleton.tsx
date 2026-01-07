import React from 'react';

export const VerseSkeleton = ({ index }: { index: number }): React.JSX.Element => (
  <div
    aria-hidden="true"
    className={`border-b border-border/60 py-8 animate-pulse ${
      index === 0 ? 'border-t border-border/60' : ''
    }`}
  >
    <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
      <div className="hidden md:flex md:w-16 flex-col gap-3 pt-1">
        <div className="h-6 w-6 rounded-md bg-interactive/80" />
        <div className="h-6 w-6 rounded-md bg-interactive/80" />
        <div className="h-6 w-6 rounded-md bg-interactive/80" />
        <div className="h-6 w-6 rounded-md bg-interactive/80" />
      </div>

      <div className="space-y-10 md:flex-grow">
        <div className="flex justify-end w-full">
          <div className="h-10 w-3/4 rounded-md bg-interactive/80" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-32 rounded-md bg-interactive/50" />
          <div className="h-4 w-full rounded-md bg-interactive/70" />
          <div className="h-4 w-5/6 rounded-md bg-interactive/70" />
        </div>
      </div>
    </div>
  </div>
);
