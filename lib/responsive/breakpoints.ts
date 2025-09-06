import React from 'react';

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'wide';

const getBreakpointSnapshot = (): BreakpointKey => {
  if (typeof window === 'undefined') return 'mobile';
  if (window.matchMedia('(min-width: 1280px)').matches) return 'wide';
  if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
  if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
  return 'mobile';
};

const subscribeBreakpoint = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const queries = [
    window.matchMedia('(min-width: 768px)'),
    window.matchMedia('(min-width: 1024px)'),
    window.matchMedia('(min-width: 1280px)'),
  ];

  queries.forEach((q) => q.addEventListener('change', callback));

  return () => {
    queries.forEach((q) => q.removeEventListener('change', callback));
  };
};

export const breakpointStore = {
  subscribe: subscribeBreakpoint,
  getSnapshot: getBreakpointSnapshot,
  getServerSnapshot: (): BreakpointKey => 'mobile',
};

export const useBreakpoint = (): BreakpointKey =>
  React.useSyncExternalStore(
    breakpointStore.subscribe,
    breakpointStore.getSnapshot,
    breakpointStore.getServerSnapshot
  );
