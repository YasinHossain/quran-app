'use client';
import { SearchIcon } from '@/app/shared/icons';

import type { JSX, KeyboardEvent, ReactNode } from 'react';

type SearchVariant = 'main' | 'default' | 'glass' | 'header' | 'panel';
type SearchSize = 'sm' | 'md' | 'lg';

type SizeStyles = {
  container: string;
  inputBase: string; // base padding without right pad
  rightPad: string; // default right padding
  icon: { size: number; className: string };
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  variant?: SearchVariant;
  size?: SearchSize;
  endAdornment?: ReactNode; // visual-only trailing content (no built-in actions)
}

const getVariantStyles = (variant: SearchVariant): string => {
  switch (variant) {
    case 'header':
      return 'bg-interactive/60 text-foreground border border-border placeholder:text-muted';
    case 'panel':
      return 'bg-interactive/60 border border-border text-foreground placeholder:text-muted';
    case 'glass':
      return 'bg-surface-glass/60 text-lg text-foreground border-none placeholder:text-input-placeholder backdrop-blur-xl shadow-lg hover:shadow-xl';
    default:
      return 'bg-interactive/60 text-foreground border border-border placeholder:text-muted';
  }
};

const getSizeStyles = (size: SearchSize): SizeStyles => {
  switch (size) {
    case 'sm':
      return {
        container: 'text-mobile-sm',
        inputBase: 'pl-8 sm:pl-9 py-2 min-h-touch',
        rightPad: 'pr-3',
        icon: { size: 16, className: 'left-2.5 sm:left-3' },
      };
    case 'lg':
      return {
        container: 'text-mobile sm:text-lg',
        inputBase: 'pl-10 sm:pl-11 py-3 sm:py-3.5 min-h-touch-lg',
        rightPad: 'pr-4',
        icon: { size: 18, className: 'left-3 sm:left-3.5' },
      };
    default: // md
      return {
        container: 'text-mobile',
        inputBase: 'pl-9 sm:pl-10 py-2.5 min-h-touch',
        rightPad: 'pr-4',
        icon: { size: 18, className: 'left-3 sm:left-3.5' },
      };
  }
};

const getFocusStyles = (variant: SearchVariant): string => {
  switch (variant) {
    case 'panel':
      return 'focus:ring-2 focus:ring-accent focus:border-transparent';
    default:
      return 'focus:ring-1 focus:ring-accent';
  }
};

const getHoverStyles = (variant: SearchVariant): string => {
  switch (variant) {
    case 'panel':
      return ''; // No hover effects - only focus ring appears on click
    case 'glass':
      return 'hover:shadow-xl';
    default:
      return 'hover:shadow-lg hover:ring-1 hover:ring-accent'; // Ring + shadow
  }
};

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
  className = '',
  variant = 'default',
  size = 'md',
  endAdornment,
}: SearchInputProps): JSX.Element => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const focusStyles = getFocusStyles(variant);
  const hoverStyles = getHoverStyles(variant);

  const IconComponent = SearchIcon;
  const iconSize = sizeStyles.icon.size;
  const rightPad = endAdornment ? 'pr-14' : sizeStyles.rightPad;

  return (
    <div className={`relative ${sizeStyles.container} ${className}`}>
      <IconComponent
        size={iconSize}
        className={`absolute ${sizeStyles.icon.className} top-1/2 -translate-y-1/2 text-muted`}
      />
      <input
        type="text"
        value={value}
        onChange={(e): void => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className={`w-full ${sizeStyles.inputBase} ${rightPad} rounded-lg outline-none focus:outline-none ${focusStyles} transition-all duration-300 ${hoverStyles} ${variantStyles} touch-manipulation`}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        inputMode="search"
      />
      {endAdornment && (
        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          {endAdornment}
        </div>
      )}
    </div>
  );
};
