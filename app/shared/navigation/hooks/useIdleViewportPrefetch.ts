'use client';

import { useEffect, type RefObject } from 'react';

const DEFAULT_DELAY_MS = 2500;
const DEFAULT_LIMIT = 8;
const DEFAULT_IDLE_TIMEOUT_MS = 1200;

type PrefetchFn = (href: string) => void | Promise<void>;

const scheduleIdleWork = (work: () => void, delayMs: number): (() => void) => {
  const win = window as unknown as {
    requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  let delayTimer: number | null = null;
  let idleHandle: number | null = null;
  let fallbackTimer: number | null = null;

  const run = () => {
    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(work, { timeout: DEFAULT_IDLE_TIMEOUT_MS });
      return;
    }
    fallbackTimer = window.setTimeout(work, 0);
  };

  delayTimer = window.setTimeout(run, Math.max(0, delayMs));

  return () => {
    if (delayTimer !== null) window.clearTimeout(delayTimer);
    if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    if (idleHandle !== null) win.cancelIdleCallback?.(idleHandle);
  };
};

const isInViewport = (el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  return rect.bottom > 0 && rect.top < window.innerHeight;
};

export function useIdleViewportPrefetch(options: {
  enabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  prefetch: PrefetchFn;
  hrefMatch: RegExp;
  delayMs?: number;
  limit?: number;
}): void {
  const { enabled, containerRef, prefetch, hrefMatch } = options;
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  const limit = options.limit ?? DEFAULT_LIMIT;

  useEffect(() => {
    if (!enabled) return;
    if (process.env.NODE_ENV === 'test') return;
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const cancel = scheduleIdleWork(() => {
      if (cancelled) return;
      const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
      const hrefs: string[] = [];

      for (const anchor of anchors) {
        const href = anchor.getAttribute('href');
        if (!href || !hrefMatch.test(href)) continue;
        if (!isInViewport(anchor)) continue;
        hrefs.push(href);
        if (hrefs.length >= limit) break;
      }

      for (const href of new Set(hrefs)) {
        try {
          void prefetch(href);
        } catch {
          // Ignore prefetch errors.
        }
      }
    }, delayMs);

    return () => {
      cancelled = true;
      cancel();
    };
  }, [containerRef, delayMs, enabled, hrefMatch, limit, prefetch]);
}

