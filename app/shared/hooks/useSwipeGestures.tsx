'use client';

import { useRef, useCallback } from 'react';

import { computeMetrics, shouldPreventDefault } from './swipeGestures/gestureCalculations';
import { handleSwipeDecision } from './swipeGestures/swipeDecision';

import type { TouchPoint } from './swipeGestures/gestureCalculations';
import type { SwipeGesturesOptions } from './swipeGestures/types';
import type React from 'react';

interface UseSwipeGesturesReturn {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
}

export const useSwipeGestures = (options: SwipeGesturesOptions): UseSwipeGesturesReturn => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
  } = options;

  const touchStart = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent): void => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent): void => {
      if (!touchStart.current) return;

      const touch = event.changedTouches[0];
      const touchEnd: TouchPoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      const metrics = computeMetrics(touchEnd, touchStart.current);
      handleSwipeDecision(
        metrics,
        { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown },
        threshold,
        velocity
      );
      touchStart.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity]
  );

  const handleTouchMove = useCallback((event: React.TouchEvent): void => {
    if (touchStart.current) {
      const touch = event.touches[0];
      const currentTouch: TouchPoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };

      if (shouldPreventDefault(currentTouch, touchStart.current)) {
        event.preventDefault();
      }
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
};
