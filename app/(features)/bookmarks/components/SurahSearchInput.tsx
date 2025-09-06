import React from 'react';

interface SurahSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SurahSearchInput = ({
  value,
  onChange,
  onKeyDown,
  inputRef,
}: SurahSearchInputProps): React.JSX.Element => (
  <div className="p-3 border-b border-border">
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Search surahs..."
      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none text-foreground placeholder-muted"
    />
  </div>
);
