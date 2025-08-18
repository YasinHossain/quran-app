import React from 'react';
import Image from 'next/image';

interface Props {
  cover: string;
  title: string;
  artist: string;
}

export default function TrackInfo({ cover, title, artist }: Props) {
  const fallback =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%' height='100%' rx='12' ry='12' fill='%23e5e7eb'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, sans-serif' font-size='12' fill='%239ca3af'>No cover</text></svg>";
  return (
    <div className="flex items-center gap-3 min-w-0 sm:min-w-[220px] flex-shrink-0">
      <Image
        src={cover || fallback}
        alt="cover"
        width={48}
        height={48}
        className="h-12 w-12 rounded-full shadow-sm object-cover"
        unoptimized
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
      <div className="min-w-0 hidden sm:block">
        <div
          className="text-sm font-semibold tracking-[-0.01em] truncate text-foreground"
          aria-label="current track title"
        >
          {title}
        </div>
        <div className="text-xs -mt-0.5 truncate text-muted">{artist}</div>
      </div>
    </div>
  );
}
