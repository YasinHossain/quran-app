import React from 'react';
import { ChevronDownIcon } from './icons';
import { useTheme } from '@/app/providers/ThemeContext';

interface SelectionBoxProps {
  label: string;
  value: string;
  onClick: () => void;
}

const SelectionBox = ({ label, value, onClick }: SelectionBoxProps) => {
  const { theme } = useTheme();
  
  const boxClasses =
    theme === 'light'
      ? 'bg-white border border-gray-200 text-gray-700'
      : 'bg-gray-800 border border-gray-600 text-gray-200';

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <button
        onClick={onClick}
        className={`w-full flex justify-between items-center ${boxClasses} rounded-lg p-2.5 text-sm text-left focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-teal-600`}
      >
        <span className="truncate">{value}</span>
        <ChevronDownIcon className="text-gray-500" />
      </button>
    </div>
  );
};

export default SelectionBox;