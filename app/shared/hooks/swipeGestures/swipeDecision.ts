import type { SwipeMetrics } from './gestureCalculations';
import type { SwipeHandlers } from './types';

export const handleSwipeDecision = (
  metrics: SwipeMetrics,
  handlers: SwipeHandlers,
  threshold: number,
  velocity: number
) => {
  const { deltaX, deltaY, velocityX, velocityY } = metrics;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const isHorizontalSwipe = absX > absY && absX > threshold;
  const isVerticalSwipe = absY > absX && absY > threshold;

  if (isHorizontalSwipe && velocityX > velocity) {
    if (deltaX > 0) handlers.onSwipeRight?.();
    else handlers.onSwipeLeft?.();
    return;
  }

  if (isVerticalSwipe && velocityY > velocity) {
    if (deltaY > 0) handlers.onSwipeDown?.();
    else handlers.onSwipeUp?.();
  }
};
