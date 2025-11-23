export const MUSHAF_SCALE_MIN: number = 1;
export const MUSHAF_SCALE_MAX: number = 10;

const MUSHAF_FONT_MIN_PX: number = 20;
const MUSHAF_FONT_MAX_PX: number = 44;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Map a discrete Mushaf zoom scale (1–10) to a concrete font size in pixels.
 * Keeps the zoom slider behaviour predictable across devices.
 */
export const mushafScaleToFontSize = (scale: number): number => {
  const clampedScale = clamp(Math.round(scale), MUSHAF_SCALE_MIN, MUSHAF_SCALE_MAX);
  if (MUSHAF_SCALE_MAX === MUSHAF_SCALE_MIN) return MUSHAF_FONT_MIN_PX;
  const t = (clampedScale - MUSHAF_SCALE_MIN) / (MUSHAF_SCALE_MAX - MUSHAF_SCALE_MIN);
  const size = MUSHAF_FONT_MIN_PX + t * (MUSHAF_FONT_MAX_PX - MUSHAF_FONT_MIN_PX);
  return Math.round(size);
};

/**
 * Inverse of {@link mushafScaleToFontSize}. Resolve the closest Mushaf scale step
 * for an arbitrary Arabic font size so the zoom slider stays in sync.
 */
export const fontSizeToMushafScale = (fontSize: number): number => {
  const clampedSize = clamp(fontSize, MUSHAF_FONT_MIN_PX, MUSHAF_FONT_MAX_PX);
  if (MUSHAF_FONT_MAX_PX === MUSHAF_FONT_MIN_PX) return MUSHAF_SCALE_MIN;
  const t = (clampedSize - MUSHAF_FONT_MIN_PX) / (MUSHAF_FONT_MAX_PX - MUSHAF_FONT_MIN_PX);
  const scale = MUSHAF_SCALE_MIN + t * (MUSHAF_SCALE_MAX - MUSHAF_SCALE_MIN);
  return clamp(Math.round(scale), MUSHAF_SCALE_MIN, MUSHAF_SCALE_MAX);
};
