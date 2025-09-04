'use client';

import { useRef, useCallback } from 'react';

interface SwipeGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe
  velocity?: number; // Minimum velocity for swipe
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (options: SwipeGesturesOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
  } = options;

  const touchStart = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!touchStart.current) return;

      const touch = event.changedTouches[0];
      const touchEnd = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStart.current.x;
      const deltaY = touchEnd.y - touchStart.current.y;
      const deltaTime = touchEnd.time - touchStart.current.time;

      // Calculate velocity (pixels per ms)
      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Determine if it's a significant swipe
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold;
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold;

      if (isHorizontalSwipe && velocityX > velocity) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else if (isVerticalSwipe && velocityY > velocity) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }

      touchStart.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity]
  );

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    // Prevent default behavior for vertical swipes on main content
    // to avoid iOS Safari bounce effect
    if (touchStart.current) {
      const touch = event.touches[0];
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      const deltaX = Math.abs(touch.clientX - touchStart.current.x);

      if (deltaY > deltaX && deltaY > 10) {
        // This is likely a vertical scroll, allow it
        return;
      }

      if (deltaX > 10) {
        // This is likely a horizontal swipe, prevent default
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
