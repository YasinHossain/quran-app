'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ErrorCardProps {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export const ErrorCard = ({ title = 'Error', message, action, className }: ErrorCardProps) => {
  return (
    <div
      className={cn(
        'text-center py-8 px-6 text-status-error bg-status-error/10 border border-status-error/20 rounded-lg',
        className
      )}
    >
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-90 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
