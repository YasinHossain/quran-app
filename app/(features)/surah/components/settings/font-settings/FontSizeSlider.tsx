import React from 'react';
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
  style,
}: FontSizeSliderProps): ReactElement {
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <label className="text-foreground">{label}</label>
        <span className="font-semibold text-accent" suppressHydrationWarning>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={style}
        suppressHydrationWarning
      />
    </div>
  );
}
