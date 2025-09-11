import React from 'react';

export type OrientationKey = 'portrait' | 'landscape';

export interface OrientationConfig<T> {
  portrait?: T;
  landscape?: T;
}

const getOrientationSnapshot = (): OrientationKey => {
  if (typeof window === 'undefined') return 'portrait';
  if (!window.matchMedia) return 'portrait';

  try {
    return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
  } catch {
    return 'portrait';
  }
};

const subscribeOrientation = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  if (!window.matchMedia) return () => {};

  try {
    const orientationQuery = window.matchMedia('(orientation: landscape)');
    orientationQuery.addEventListener('change', callback);
    return () => orientationQuery.removeEventListener('change', callback);
  } catch {
    return () => {};
  }
};

export const orientationStore = {
  subscribe: subscribeOrientation,
  getSnapshot: getOrientationSnapshot,
  getServerSnapshot: (): OrientationKey => 'portrait',
};

export const useOrientation = (): OrientationKey =>
  React.useSyncExternalStore(
    orientationStore.subscribe,
    orientationStore.getSnapshot,
    orientationStore.getServerSnapshot
  );

export const getOrientationValue = <T>(
  config: OrientationConfig<T>,
  fallback: T,
  orientation: OrientationKey
): T => {
  if (orientation === 'landscape' && config.landscape !== undefined) {
    return config.landscape;
  }
  if (orientation === 'portrait' && config.portrait !== undefined) {
    return config.portrait;
  }
  return fallback;
};
