import React from 'react';

interface Props {
  title: string;
  artist: string;
}

export function TrackInfo({ title, artist }: Props): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 min-w-0 flex-shrink-0 sm:min-w-[220px] pl-1">
      <div className="min-w-0 flex-1 sm:flex-initial">
        <div
          className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground"
          aria-label="current track title"
        >
          {title}
        </div>
        <div className="text-xs -mt-0.5 truncate text-muted sm:block">{artist}</div>
      </div>
    </div>
  );
}
