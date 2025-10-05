'use client';

import { useRef, useCallback, useMemo } from 'react';

import { computeMetrics, shouldPreventDefault } from './swipeGestures/gestureCalculations';
import { handleSwipeDecision } from './swipeGestures/swipeDecision';

import type { TouchPoint } from './swipeGestures/gestureCalculations';
import type { SwipeGesturesOptions } from './swipeGestures/types';
import type React from 'react';

type SwipeHandlers = Pick<
  SwipeGesturesOptions,
  'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp' | 'onSwipeDown'
>;

const createTouchPoint = (touch: React.Touch): TouchPoint => ({
  x: touch.clientX,
  y: touch.clientY,
  time: Date.now(),
});

const resolveHandlers = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: SwipeGesturesOptions): SwipeHandlers => {
  const handlers: SwipeHandlers = {};
  if (onSwipeLeft) handlers.onSwipeLeft = onSwipeLeft;
  if (onSwipeRight) handlers.onSwipeRight = onSwipeRight;
  if (onSwipeUp) handlers.onSwipeUp = onSwipeUp;
  if (onSwipeDown) handlers.onSwipeDown = onSwipeDown;
  return handlers;
};

const useTouchEndHandler = (
  touchStart: React.MutableRefObject<TouchPoint | null>,
  handlers: SwipeHandlers,
  threshold: number,
  velocity: number
): React.TouchEventHandler =>
  useCallback(
    (event: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const metrics = computeMetrics(createTouchPoint(touch), touchStart.current);
      handleSwipeDecision(metrics, handlers, threshold, velocity);
      touchStart.current = null;
    },
    [handlers, threshold, touchStart, velocity]
  );

interface UseSwipeGesturesReturn {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
}

export function useSwipeGestures(options: SwipeGesturesOptions): UseSwipeGesturesReturn {
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
    if (!touch) return;
    touchStart.current = createTouchPoint(touch);
  }, []);

  const swipeHandlers = useMemo(
    () =>
      resolveHandlers({
        ...(onSwipeLeft ? { onSwipeLeft } : {}),
        ...(onSwipeRight ? { onSwipeRight } : {}),
        ...(onSwipeUp ? { onSwipeUp } : {}),
        ...(onSwipeDown ? { onSwipeDown } : {}),
      }),
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  const handleTouchEnd = useTouchEndHandler(touchStart, swipeHandlers, threshold, velocity);

  const handleTouchMove = useCallback((event: React.TouchEvent): void => {
    if (!touchStart.current) return;
    const touch = event.touches[0];
    if (!touch) return;

    const currentTouch = createTouchPoint(touch);
    if (shouldPreventDefault(currentTouch, touchStart.current)) {
      event.preventDefault();
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
}
