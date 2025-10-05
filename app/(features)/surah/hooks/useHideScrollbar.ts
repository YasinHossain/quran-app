'use client';

import { RefObject, useEffect } from 'react';

export const useHideScrollbar = (ref: RefObject<HTMLElement | null>, className?: string): void => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const styleDecl = el.style as CSSStyleDeclaration & {
      msOverflowStyle?: string;
      scrollbarWidth?: string;
    };
    styleDecl.msOverflowStyle = 'none';
    styleDecl.scrollbarWidth = 'none';

    const style = document.createElement('style');
    const selector = className ? `.${className}` : '';
    style.textContent = `
      ${selector}::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [ref, className]);
};
