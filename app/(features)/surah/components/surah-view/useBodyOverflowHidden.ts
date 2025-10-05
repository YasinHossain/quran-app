'use client';

import { useEffect } from 'react';

export const useBodyOverflowHidden = (): void => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, []);
};
