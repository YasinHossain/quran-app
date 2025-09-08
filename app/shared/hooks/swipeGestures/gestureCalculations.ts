export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface SwipeMetrics {
  deltaX: number;
  deltaY: number;
  deltaTime: number;
  velocityX: number;
  velocityY: number;
}

export const computeMetrics = (end: TouchPoint, start: TouchPoint): SwipeMetrics => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const deltaTime = end.time - start.time;

  return {
    deltaX,
    deltaY,
    deltaTime,
    velocityX: Math.abs(deltaX) / deltaTime,
    velocityY: Math.abs(deltaY) / deltaTime,
  };
};

export const shouldPreventDefault = (currentTouch: TouchPoint, startTouch: TouchPoint): boolean => {
  const deltaY = Math.abs(currentTouch.y - startTouch.y);
  const deltaX = Math.abs(currentTouch.x - startTouch.x);

  if (deltaY > deltaX && deltaY > 10) {
    // This is likely a vertical scroll, allow it
    return false;
  }

  if (deltaX > 10) {
    // This is likely a horizontal swipe, prevent default
    return true;
  }

  return false;
};
