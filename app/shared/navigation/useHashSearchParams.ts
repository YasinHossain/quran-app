'use client';

import { useMemo, useSyncExternalStore } from 'react';

const getHashSnapshot = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.hash ?? '';
};

const listeners = new Set<() => void>();
let isPatched = false;
let originalPushState: History['pushState'] | null = null;
let originalReplaceState: History['replaceState'] | null = null;

const broadcast = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

const ensurePatched = (): void => {
  if (typeof window === 'undefined') return;
  if (isPatched) return;
  isPatched = true;

  window.addEventListener('hashchange', broadcast);
  window.addEventListener('popstate', broadcast);

  originalPushState = window.history.pushState.bind(window.history);
  originalReplaceState = window.history.replaceState.bind(window.history);

  // Next.js App Router updates the URL via history APIs; hash-only navigations
  // may not trigger `hashchange`, so we also hook push/replace to notify.
  window.history.pushState = function (...args: Parameters<History['pushState']>): void {
    originalPushState?.(...args);
    broadcast();
  };

  window.history.replaceState = function (...args: Parameters<History['replaceState']>): void {
    originalReplaceState?.(...args);
    broadcast();
  };
};

const maybeUnpatch = (): void => {
  if (typeof window === 'undefined') return;
  if (!isPatched) return;
  if (listeners.size > 0) return;

  window.removeEventListener('hashchange', broadcast);
  window.removeEventListener('popstate', broadcast);

  if (originalPushState) {
    window.history.pushState = originalPushState;
  }
  if (originalReplaceState) {
    window.history.replaceState = originalReplaceState;
  }

  originalPushState = null;
  originalReplaceState = null;
  isPatched = false;
};

const subscribeToHash = (onStoreChange: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  ensurePatched();
  listeners.add(onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    maybeUnpatch();
  };
};

export function useHashSearchParams(): URLSearchParams {
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, () => '');

  return useMemo(() => {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    return new URLSearchParams(raw);
  }, [hash]);
}
