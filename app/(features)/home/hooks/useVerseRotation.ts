'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseVerseRotationOptions {
  interval?: number;
  onRotate: () => void;
  enabled?: boolean;
}

interface UseVerseRotationReturn {
  startRotation: () => void;
  stopRotation: () => void;
  isRotating: boolean;
}

/**
 * Hook for automatically rotating verses at specified intervals
 */
export function useVerseRotation({
  interval = 10000,
  onRotate,
  enabled = true,
}: UseVerseRotationOptions): UseVerseRotationReturn {
  const intervalRef = useRef<NodeJS.Timeout | undefined>();
  const isRotatingRef = useRef(false);

  const startRotation = useCallback(() => {
    if (intervalRef.current || !enabled) return;

    isRotatingRef.current = true;
    intervalRef.current = setInterval(() => {
      onRotate();
    }, interval);
  }, [interval, onRotate, enabled]);

  const stopRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      isRotatingRef.current = false;
    }
  }, []);

  // Auto-start rotation when enabled
  useEffect(() => {
    if (enabled) {
      startRotation();
    } else {
      stopRotation();
    }

    return stopRotation;
  }, [enabled, startRotation, stopRotation]);

  return {
    startRotation,
    stopRotation,
    isRotating: isRotatingRef.current,
  };
}
