'use client';

import { memo } from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Reusable tab button component with consistent styling
 * Handles active/inactive states and hover effects
 */
export const TabButton = memo(function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors w-16 sm:w-20 md:w-24 ${
        isActive ? 'bg-surface shadow text-foreground' : 'text-muted hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
});
