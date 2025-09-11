import type { SwipeMetrics } from './gestureCalculations';
import type { SwipeHandlers } from './types';

type Direction = 'left' | 'right' | 'up' | 'down';

const getSwipeDirection = (
  { deltaX, deltaY, velocityX, velocityY }: SwipeMetrics,
  threshold: number,
  velocity: number
): Direction | null => {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX > absY && absX > threshold && velocityX > velocity) {
    return deltaX > 0 ? 'right' : 'left';
  }

  if (absY > absX && absY > threshold && velocityY > velocity) {
    return deltaY > 0 ? 'down' : 'up';
  }

  return null;
};

export const handleSwipeDecision = (
  metrics: SwipeMetrics,
  handlers: SwipeHandlers,
  threshold: number,
  velocity: number
): void => {
  const direction = getSwipeDirection(metrics, threshold, velocity);
  if (!direction) return;

  const handlersMap: Record<Direction, (() => void) | undefined> = {
    left: handlers.onSwipeLeft,
    right: handlers.onSwipeRight,
    up: handlers.onSwipeUp,
    down: handlers.onSwipeDown,
  };

  handlersMap[direction]?.();
};
