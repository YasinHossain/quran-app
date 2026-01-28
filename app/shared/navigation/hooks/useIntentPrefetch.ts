'use client';

import { useCallback, useRef } from 'react';

const DEFAULT_TOUCH_DELAY_MS = 120;
const DEFAULT_TOUCH_MOVE_THRESHOLD_PX = 12;

type PrefetchFn = (href: string) => void | Promise<void>;

export function useIntentPrefetch(
  prefetch: PrefetchFn,
  options?: { touchDelayMs?: number; touchMoveThresholdPx?: number }
): {
  onMouseEnter: (href: string) => void;
  onFocus: (href: string) => void;
  onTouchStart: (event: React.TouchEvent, href: string) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
} {
  const touchDelayMs = options?.touchDelayMs ?? DEFAULT_TOUCH_DELAY_MS;
  const touchMoveThresholdPx = options?.touchMoveThresholdPx ?? DEFAULT_TOUCH_MOVE_THRESHOLD_PX;

  const pendingHrefRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const touchStartPointRef = useRef<{ x: number; y: number } | null>(null);

  const clearPending = useCallback(() => {
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    pendingHrefRef.current = null;
    touchStartPointRef.current = null;
  }, []);

  const prefetchNow = useCallback(
    (href: string) => {
      clearPending();
      try {
        void prefetch(href);
      } catch {
        // Ignore prefetch errors.
      }
    },
    [clearPending, prefetch]
  );

  const onMouseEnter = useCallback((href: string) => prefetchNow(href), [prefetchNow]);
  const onFocus = useCallback((href: string) => prefetchNow(href), [prefetchNow]);

  const onTouchStart = useCallback(
    (event: React.TouchEvent, href: string) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;

      clearPending();
      pendingHrefRef.current = href;
      touchStartPointRef.current = { x: touch.clientX, y: touch.clientY };

      pendingTimerRef.current = window.setTimeout(() => {
        if (!pendingHrefRef.current) return;
        prefetchNow(pendingHrefRef.current);
      }, touchDelayMs);
    },
    [clearPending, prefetchNow, touchDelayMs]
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (pendingTimerRef.current === null) return;
      const start = touchStartPointRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);
      if (dx > touchMoveThresholdPx || dy > touchMoveThresholdPx) {
        clearPending();
      }
    },
    [clearPending, touchMoveThresholdPx]
  );

  const onTouchEnd = useCallback(() => clearPending(), [clearPending]);
  const onTouchCancel = useCallback(() => clearPending(), [clearPending]);

  return { onMouseEnter, onFocus, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel };
}

