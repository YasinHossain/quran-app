export type Orientation = 'portrait' | 'landscape';

/**
 * Determine orientation based on viewport width
 */
export const getOrientationByWidth = (width: number): Orientation =>
  width > 800 ? 'landscape' : 'portrait';
