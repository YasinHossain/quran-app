'use client';

import React from 'react';

const DEFAULT_LIST_HEIGHT = 600;

export function useVerseListHeight(offset = 240, minHeight = 320): number {
  const [height, setHeight] = React.useState<number>(DEFAULT_LIST_HEIGHT);

  React.useEffect(() => {
    const updateHeight = (): void => {
      if (typeof window === 'undefined') return;
      const nextHeight = window.innerHeight - offset;
      setHeight(Math.max(minHeight, Number.isFinite(nextHeight) ? nextHeight : minHeight));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [offset, minHeight]);

  return height;
}
