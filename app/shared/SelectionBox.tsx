import React, { memo } from 'react';

import { ChevronDownIcon } from './icons';

interface SelectionBoxProps {
  label: string;
  value: string;
  onClick: () => void;
}

export const SelectionBox = memo(function SelectionBox({
  label,
  value,
  onClick,
}: SelectionBoxProps): React.JSX.Element {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-foreground">{label}</label>
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center bg-surface text-foreground border border-border rounded-lg p-2.5 text-sm text-left focus:outline-none focus-visible:outline-none focus:ring-0 transition-all duration-300 hover:bg-accent/10"
        style={{ outline: 'none' }}
      >
        <span className="truncate">{value}</span>
        <ChevronDownIcon className="text-muted" />
      </button>
    </div>
  );
});
