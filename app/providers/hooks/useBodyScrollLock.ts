'use client';

import { useEffect } from 'react';

export const useBodyScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const original = document.body.style.overflow;
    document.body.style.overflow = locked ? 'hidden' : '';

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
};
