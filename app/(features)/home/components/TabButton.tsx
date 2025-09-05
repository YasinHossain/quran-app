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
      className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
        isActive ? 'bg-surface shadow text-foreground' : 'text-muted hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
});
