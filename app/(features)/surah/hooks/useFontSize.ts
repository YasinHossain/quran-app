import { useMemo, CSSProperties } from 'react';

/**
 * Calculate the font size percentage and corresponding style for a slider.
 *
 * The `value` is expected to be within the `[min, max]` range. Values outside
 * this range are clamped before calculating the percentage.
 */
export const useFontSize = (
  value: number,
  min: number,
  max: number
): { percentage: number; style: CSSProperties } => {
  const percentage = useMemo(() => {
    const clamped = Math.min(Math.max(value, min), max);
    return ((clamped - min) / (max - min)) * 100;
  }, [value, min, max]);

  const style = useMemo(
    () =>
      ({
        '--value-percent': `${percentage}%`,
      }) as CSSProperties,
    [percentage]
  );

  return { percentage, style };
};
