'use client';

import { useEffect } from 'react';

let scrollLockCount = 0;
let originalHtmlOverflow: string | null = null;
let originalBodyOverflow: string | null = null;
let originalBodyPaddingRight: string | null = null;

const lockScroll = (): void => {
  // Only capture original styles and apply the lock once.
  if (scrollLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    originalHtmlOverflow = html.style.overflow;
    originalBodyOverflow = body.style.overflow;
    originalBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // Prevent layout shift when the scrollbar disappears.
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  scrollLockCount += 1;
};

const unlockScroll = (): void => {
  if (scrollLockCount <= 0) return;

  scrollLockCount -= 1;

  if (scrollLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = originalHtmlOverflow ?? '';
    body.style.overflow = originalBodyOverflow ?? '';
    body.style.paddingRight = originalBodyPaddingRight ?? '';

    originalHtmlOverflow = null;
    originalBodyOverflow = null;
    originalBodyPaddingRight = null;
  }
};

export const useBodyScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (locked) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }

    return undefined;
  }, [locked]);
};
