import React, { useState, useTransition, useEffect, useMemo } from 'react';

import type { CSSProperties, ReactElement } from 'react';

interface FontSizeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  style: CSSProperties;
}

export function FontSizeSlider({
  label,
  value,
  min,
  max,
  onChange,
}: FontSizeSliderProps): ReactElement {
  const [isActive, setIsActive] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [, startTransition] = useTransition();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync internal value if prop changes externally
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value;
    setInternalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        onChange(newValue);
      });
    }, 10);
  };

  // Calculate style locally for zero-latency feedback
  const dynamicStyle = useMemo(() => {
    const clamped = Math.min(Math.max(internalValue, min), max);
    const percentage = ((clamped - min) / (max - min)) * 100;
    return {
      '--value-percent': `${percentage}%`,
    } as CSSProperties;
  }, [internalValue, min, max]);

  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <label className="text-foreground">{label}</label>
        <span className="font-semibold text-accent" suppressHydrationWarning>
          {internalValue}
        </span>
      </div>
      <input
        type="range"
        className={`cursor-pointer touch-none ${isActive ? 'range-slider-active' : ''}`}
        min={min}
        max={max}
        value={internalValue}
        onChange={handleChange}
        onPointerDown={() => setIsActive(true)}
        onPointerUp={() => setIsActive(false)}
        onPointerCancel={() => setIsActive(false)}
        style={dynamicStyle}
        suppressHydrationWarning
      />
    </div>
  );
}
