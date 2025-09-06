import React from 'react';

const FOLDER_COLORS = [
  { name: 'Accent', value: 'text-accent' },
  { name: 'Primary', value: 'text-primary' },
  { name: 'Interactive', value: 'text-interactive' },
  { name: 'Success', value: 'text-status-success' },
  { name: 'Warning', value: 'text-status-warning' },
  { name: 'Error', value: 'text-status-error' },
  { name: 'Info', value: 'text-status-info' },
  { name: 'Content Accent', value: 'text-content-accent' },
];

interface ColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export const ColorSelector = ({
  selectedColor,
  setSelectedColor,
}: ColorSelectorProps): React.JSX.Element => (
  <div className="mb-6">
    <div className="block text-sm font-medium text-foreground mb-3">Color</div>
    <div className="grid grid-cols-4 gap-3">
      {FOLDER_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => setSelectedColor(color.value)}
          className={`p-3 rounded-lg border transition-all ${
            selectedColor === color.value
              ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
              : 'border-border hover:border-accent/50 hover:bg-surface-hover'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-current ${color.value} mx-auto`} />
          <span className="text-xs text-muted mt-1 block">{color.name}</span>
        </button>
      ))}
    </div>
  </div>
);
