import React from 'react';

const FOLDER_COLORS = [
  { name: 'Teal', value: 'text-accent' },
  { name: 'Brand', value: 'text-primary' },
  { name: 'Slate', value: 'text-content-secondary' },
  { name: 'Green', value: 'text-status-success' },
  { name: 'Amber', value: 'text-status-warning' },
  { name: 'Red', value: 'text-status-error' },
  { name: 'Blue', value: 'text-status-info' },
  { name: 'Emerald', value: 'text-content-accent' },
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
        <ColorOption
          key={color.value}
          color={color}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      ))}
    </div>
  </div>
);

interface ColorOptionProps {
  color: { name: string; value: string };
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorOption = ({
  color,
  selectedColor,
  setSelectedColor,
}: ColorOptionProps): React.JSX.Element => (
  <button
    type="button"
    onClick={() => setSelectedColor(color.value)}
    className={`flex h-12 w-full items-center justify-center rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
      selectedColor === color.value
        ? 'border-transparent ring-2 ring-accent shadow-sm'
        : 'border-border hover:border-accent/50'
    }`}
    aria-label={`Select ${color.name} color`}
    title={color.name}
  >
    <span className={`h-6 w-6 rounded-md bg-current ${color.value}`} aria-hidden="true" />
    <span className="sr-only">{color.name}</span>
  </button>
);
