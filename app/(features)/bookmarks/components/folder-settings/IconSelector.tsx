import React from 'react';

const FOLDER_ICONS = ['📁', '📖', '⭐', '💎', '🌟', '📚', '🔖', '💫'];

interface IconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

export const IconSelector = ({ selectedIcon, setSelectedIcon }: IconSelectorProps): React.JSX.Element => (
  <div className="mb-8">
    <div className="block text-sm font-medium text-foreground mb-3">Icon</div>
    <div className="grid grid-cols-4 gap-2">
      {FOLDER_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => setSelectedIcon(icon)}
          className={`p-3 text-xl rounded-lg border transition-all ${
            selectedIcon === icon
              ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
              : 'border-border hover:border-accent/50 hover:bg-surface-hover'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  </div>
);

