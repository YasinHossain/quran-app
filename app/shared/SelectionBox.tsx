import React, { memo, useId } from 'react';

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
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const buttonId = `${baseId}-trigger`;

  return (
    <div>
      <label
        id={labelId}
        htmlFor={buttonId}
        className="block mb-2 text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <button
        id={buttonId}
        onClick={onClick}
        type="button"
        aria-labelledby={`${labelId} ${valueId}`}
        className="w-full flex justify-between items-center bg-surface text-foreground border border-border rounded-lg p-2.5 text-sm text-left focus:outline-none focus-visible:outline-none focus:ring-0 transition-all duration-300 hover:bg-accent/10"
        style={{ outline: 'none' }}
      >
        <span id={valueId} className="truncate">
          {value}
        </span>
        <ChevronDownIcon className="text-muted" aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
});
