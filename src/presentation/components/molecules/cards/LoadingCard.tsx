'use client';

import { cn } from '@/lib/utils';
import { LoadingSpinner } from '../../atoms/loading/LoadingSpinner';

export interface LoadingCardProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingCard = ({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingCardProps) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-6 space-y-4', className)}
    >
      <LoadingSpinner size={size} />
      {message && <p className="text-muted text-sm">{message}</p>}
    </div>
  );
};
