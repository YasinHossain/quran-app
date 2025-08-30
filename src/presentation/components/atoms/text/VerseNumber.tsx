'use client';

import { cn } from '@/lib/utils';

export interface VerseNumberProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'highlighted';
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

const variantClasses = {
  default: 'bg-accent text-on-accent',
  highlighted: 'bg-primary text-on-primary',
};

export const VerseNumber = ({
  number,
  size = 'md',
  className,
  variant = 'default',
}: VerseNumberProps) => {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {number}
    </div>
  );
};
