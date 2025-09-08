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

  let direction: 'left' | 'right' | 'up' | 'down' | null = null;

  if (absX > absY && absX > threshold && velocityX > velocity) {
    direction = deltaX > 0 ? 'right' : 'left';
  } else if (absY > absX && absY > threshold && velocityY > velocity) {
    direction = deltaY > 0 ? 'down' : 'up';
  }

  const handlersMap: Record<'left' | 'right' | 'up' | 'down', (() => void) | undefined> = {
    left: handlers.onSwipeLeft,
    right: handlers.onSwipeRight,
    up: handlers.onSwipeUp,
    down: handlers.onSwipeDown,
  };

  if (direction) {
    handlersMap[direction]?.();
  }
};
