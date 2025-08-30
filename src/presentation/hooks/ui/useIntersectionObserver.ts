'use client';

import { useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  targetRef: RefObject<HTMLElement | null>;
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export const useIntersectionObserver = ({
  targetRef,
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, onIntersect, enabled, threshold, rootMargin, root]);
};
