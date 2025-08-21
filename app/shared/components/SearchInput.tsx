'use client';
import React from 'react';
import { SearchSolidIcon } from '../icons';
import { Search } from 'lucide-react';

type SearchVariant = 'main' | 'default' | 'glass' | 'header' | 'panel';
type SearchSize = 'sm' | 'md' | 'lg';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  variant?: SearchVariant;
  size?: SearchSize;
}

const getVariantStyles = (variant: SearchVariant) => {
  switch (variant) {
    case 'header':
      return 'bg-black/[.05] dark:bg-white/[.05] text-foreground border border-border placeholder:text-muted';
    case 'panel':
      return 'bg-black/[.05] dark:bg-white/[.05] border-border text-foreground placeholder-muted';
    case 'glass':
      return 'bg-surface-glass/60 text-lg text-foreground border-none placeholder-input-placeholder backdrop-blur-xl shadow-lg hover:shadow-xl';
    default:
      return 'bg-black/[.05] dark:bg-white/[.05] text-foreground border border-border placeholder:text-muted';
  }
};

const getSizeStyles = (size: SearchSize) => {
  switch (size) {
    case 'sm':
      return {
        container: 'text-mobile-sm',
        input: 'pl-8 sm:pl-9 pr-3 py-2 min-h-touch',
        icon: { size: 16, className: 'left-2.5 sm:left-3' },
      };
    case 'lg':
      return {
        container: 'text-mobile sm:text-lg',
        input: 'pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 min-h-touch-lg',
        icon: { size: 18, className: 'left-3 sm:left-3.5' },
      };
    default: // md
      return {
        container: 'text-mobile',
        input: 'pl-9 sm:pl-10 pr-4 py-2.5 min-h-touch',
        icon: { size: 18, className: 'left-3 sm:left-3.5' },
      };
  }
};

const getFocusStyles = (variant: SearchVariant) => {
  switch (variant) {
    case 'panel':
      return 'focus:ring-2 focus:ring-accent focus:border-transparent';
    default:
      return 'focus:ring-1 focus:ring-accent';
  }
};

const getHoverStyles = (variant: SearchVariant) => {
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
}: SearchInputProps) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const focusStyles = getFocusStyles(variant);
  const hoverStyles = getHoverStyles(variant);

  // Use different icons based on variant for consistency with existing designs
  const IconComponent = variant === 'panel' ? Search : SearchSolidIcon;
  const iconSize = variant === 'panel' ? sizeStyles.icon.size : sizeStyles.icon.size;

  return (
    <div className={`relative ${sizeStyles.container} ${className}`}>
      <IconComponent
        size={iconSize}
        className={`absolute ${sizeStyles.icon.className} top-1/2 -translate-y-1/2 text-muted`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className={`w-full ${sizeStyles.input} rounded-lg outline-none focus:outline-none ${focusStyles} transition-all duration-300 ${hoverStyles} ${variantStyles}`}
        style={{ touchAction: 'manipulation' }}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        inputMode="search"
      />
    </div>
  );
};
