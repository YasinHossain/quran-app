'use client';

import React, { memo, useId } from 'react';

import { ChevronRightIcon } from './icons';

interface SelectionBoxProps {
  id?: string;
  label: string;
  value: string;
  onClick: () => void;
}

export const SelectionBox = memo(function SelectionBox({
  id,
  label,
  value,
  onClick,
}: SelectionBoxProps): React.JSX.Element {
  const generatedId = useId();
  const baseId = id ?? generatedId;
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
        className="w-full flex justify-between items-center bg-surface text-foreground border border-border rounded-lg p-2.5 text-sm text-left focus:outline-none focus-visible:outline-none focus:ring-0 transition-all duration-300 hover:bg-interactive-hover"
        style={{ outline: 'none' }}
      >
        <span id={valueId} className="truncate">
          {value}
        </span>
        <ChevronRightIcon className="text-muted" aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
});
