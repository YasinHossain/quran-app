import React from 'react';

interface FontSizeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  style: React.CSSProperties;
}

export function FontSizeSlider({
  label,
  value,
  min,
  max,
  onChange,
  style,
}: FontSizeSliderProps): JSX.Element {
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
