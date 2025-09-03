import { useMemo, CSSProperties } from 'react';

export const useFontSize = (value: number, min: number, max: number) => {
  const percentage = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);

  const style = useMemo(
    () =>
      ({
        '--value-percent': `${percentage}%`,
      }) as CSSProperties,
    [percentage]
  );

  return { percentage, style };
};

export default useFontSize;
