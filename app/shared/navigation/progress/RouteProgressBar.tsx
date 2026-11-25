'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { usePublicPathname } from '@/app/shared/i18n/usePublicPathname';

import { routeKey, startRouteProgress, subscribeRouteProgress } from './routeProgress';

/** Where the bar jumps to on start, so the click is acknowledged at once. */
const START_PROGRESS = 0.12;
/** The bar creeps toward this while the next page loads, then waits for it. */
const TRICKLE_CEILING = 0.92;
const TRICKLE_INTERVAL_MS = 200;
/** How long the full bar stays before fading, and how long the fade takes. */
const COMPLETE_HOLD_MS = 180;
const FADE_MS = 280;
/** Give up if a navigation never commits (cancelled click, network failure). */
const SAFETY_TIMEOUT_MS = 10_000;

type Phase = 'idle' | 'loading' | 'complete';

function isPlainLeftClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/**
 * A thin accent bar across the top of the page that runs while a client navigation loads, so a tap
 * never feels ignored. It starts on in-app link clicks, back/forward, and `useProgressRouter`
 * pushes, and completes once the pathname or search params change.
 */
export function RouteProgressBar(): React.JSX.Element {
  const pathname = usePublicPathname();
  const searchParams = useSearchParams();
  const currentKey = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`;

  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<Phase>('idle');
  const timers = useRef<{
    trickle?: ReturnType<typeof setInterval>;
    safety?: ReturnType<typeof setTimeout>;
    hold?: ReturnType<typeof setTimeout>;
    reset?: ReturnType<typeof setTimeout>;
  }>({});

  const clearTimers = useCallback(() => {
    const t = timers.current;
    clearInterval(t.trickle);
    clearTimeout(t.safety);
    clearTimeout(t.hold);
    clearTimeout(t.reset);
    timers.current = {};
  }, []);

  const setPhaseState = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const finish = useCallback(() => {
    if (phaseRef.current !== 'loading') return;
    clearTimers();
    setProgress(1);
    timers.current.hold = setTimeout(() => {
      setPhaseState('complete');
      timers.current.reset = setTimeout(() => {
        setPhaseState('idle');
        setProgress(0);
      }, FADE_MS);
    }, COMPLETE_HOLD_MS);
  }, [clearTimers, setPhaseState]);

  const start = useCallback(() => {
    const wasLoading = phaseRef.current === 'loading';
    clearTimers();
    if (!wasLoading) setProgress(START_PROGRESS);
    setPhaseState('loading');
    timers.current.trickle = setInterval(() => {
      setProgress((p) => Math.min(TRICKLE_CEILING, p + (TRICKLE_CEILING - p) * 0.08));
    }, TRICKLE_INTERVAL_MS);
    timers.current.safety = setTimeout(finish, SAFETY_TIMEOUT_MS);
  }, [clearTimers, finish, setPhaseState]);

  useEffect(() => subscribeRouteProgress(start), [start]);

  // The new page has committed: finish whatever is running.
  const committedKeyRef = useRef(currentKey);
  useEffect(() => {
    committedKeyRef.current = currentKey;
    finish();
  }, [currentKey, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const target = anchor.getAttribute('target');
      if ((target && target !== '_self') || anchor.hasAttribute('download')) return;
      startRouteProgress(anchor.href);
    };

    // Back/forward: the URL has already changed, so compare it with the page on screen.
    const onPopState = (): void => {
      if (routeKey(window.location) !== committedKeyRef.current) startRouteProgress();
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const visible = phase === 'loading';
  // Snap back to zero while hidden so the next run grows from the start edge, not backwards.
  const animateWidth = phase !== 'idle';

  return (
    <div
      aria-hidden="true"
      data-testid="route-progress"
      data-state={phase}
      className="pointer-events-none fixed inset-x-0 top-0 z-max h-[3px]"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <div
        className="route-progress-fill h-full bg-accent"
        style={{
          transform: `scaleX(${progress})`,
          transition: animateWidth ? `transform ${TRICKLE_INTERVAL_MS}ms ease-out` : 'none',
        }}
      />
    </div>
  );
}
