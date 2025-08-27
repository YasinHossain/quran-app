import { useEffect, useRef, useState } from 'react';
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';

export const useListHeight = (isOpen: boolean) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const element = listContainerRef.current;
    if (!element || !isOpen) return;

    const updateHeight = () => {
      const rect = element.getBoundingClientRect();
      const fallback = window.innerHeight - rect.top;
      setListHeight(rect.height || fallback);
    };

    updateHeight();

    const ResizeObserverConstructor =
      typeof ResizeObserver !== 'undefined' ? ResizeObserver : ResizeObserverPolyfill;

    if (ResizeObserverConstructor) {
      const observer = new ResizeObserverConstructor((entries) => {
        for (const entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          const fallback = window.innerHeight - rect.top;
          setListHeight(entry.contentRect.height || fallback);
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isOpen]);

  return {
    listContainerRef,
    listHeight,
  };
};
