'use client';

import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils/cn';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';

interface NumberBadgeProps {
  number: string | number;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl',
};

export const NumberBadge = ({
  number,
  isActive = false,
  className,
  size = 'md',
}: NumberBadgeProps): React.JSX.Element => {
  const { i18n } = useTranslation();
  const displayValue =
    typeof number === 'number'
      ? formatNumber(number, i18n.language, { useGrouping: false })
      : localizeDigits(String(number), i18n.language);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl font-bold transition-colors',
        sizeClasses[size],
        isActive
          ? 'bg-number-badge text-accent'
          : 'bg-number-badge text-accent group-hover:bg-number-badge-hover',
        className
      )}
    >
      {displayValue}
    </div>
  );
};
