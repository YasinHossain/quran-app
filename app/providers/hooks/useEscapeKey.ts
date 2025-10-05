'use client';

import { useEffect } from 'react';

export const useEscapeKey = (enabled: boolean, onEscape: () => void): void => {
  useEffect(() => {
    if (!enabled) return;
    const handle = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [enabled, onEscape]);
};
