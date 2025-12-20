'use client';
import React from 'react';

export interface Resource {
  id: number | string;
  name: string;
  lang: string;
}

export interface ResourceItemProps<T extends Resource> {
  item: T;
  isSelected: boolean;
  onToggle: (id: number | string) => void;
  style?: React.CSSProperties;
}

export const ResourceItem = <T extends Resource>({
  item,
  isSelected,
  onToggle,
  style,
}: ResourceItemProps<T>): React.JSX.Element => {
  const handleClick = (): void => {
    onToggle(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between px-4 py-2.5 h-[50px] rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${isSelected
        ? 'bg-accent border border-accent'
        : 'bg-surface border border-border hover:bg-interactive'
        }`}
      style={style}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p
          className={`font-medium text-sm leading-tight truncate ${isSelected ? 'text-white' : 'text-foreground'
            }`}
          title={item.name}
        >
          {item.name}
        </p>
      </div>
    </div>
  );
};
