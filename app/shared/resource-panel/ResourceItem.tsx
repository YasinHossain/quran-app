'use client';

import React from 'react';

interface Resource {
  id: number;
  name: string;
  lang: string;
}

interface ResourceItemProps<T extends Resource> {
  item: T;
  isSelected: boolean;
  onToggle: (id: number) => void;
  theme: string;
  style?: React.CSSProperties;
}

export const ResourceItem = <T extends Resource>({
  item,
  isSelected,
  onToggle,
  theme,
  style,
}: ResourceItemProps<T>) => {
  const handleClick = () => {
    onToggle(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      className={`flex items-center justify-between px-4 py-2.5 h-[50px] rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${
        isSelected
          ? theme === 'dark'
            ? 'bg-blue-900/30'
            : 'bg-blue-50'
          : theme === 'dark'
            ? 'bg-slate-700/50 hover:bg-gray-700'
            : 'bg-white border border-slate-100 hover:bg-slate-50'
      }`}
      style={style}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p
          className={`font-medium text-sm leading-tight truncate ${
            isSelected
              ? theme === 'dark'
                ? 'text-blue-200'
                : 'text-blue-800'
              : theme === 'dark'
                ? 'text-[var(--foreground)]'
                : 'text-slate-800'
          }`}
          title={item.name}
        >
          {item.name}
        </p>
      </div>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isSelected && (
          <CheckIcon
            className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
          />
        )}
      </div>
    </div>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default ResourceItem;
