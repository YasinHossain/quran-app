import React from 'react';
import { Translation } from './translationPanel.types';

interface TranslationItemProps {
  item: Translation;
  isSelected: boolean;
  onToggle: (id: number) => void;
  theme: string;
}

export const TranslationItem: React.FC<TranslationItemProps> = ({
  item,
  isSelected,
  onToggle,
  theme,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle(item.id);
    }
  };

  return (
    <div
      onClick={() => onToggle(item.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between px-4 py-3 h-[52px] rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? theme === 'dark'
            ? 'bg-blue-900/30 border-blue-700/50 shadow-sm'
            : 'bg-blue-50 border-blue-200 shadow-sm'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p
          className={`font-medium text-sm leading-tight truncate ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}
          title={item.name}
        >
          {item.name}
        </p>
      </div>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isSelected && <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
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
