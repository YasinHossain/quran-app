'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

interface SlideOverPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const SlideOverPanel = ({
  isOpen,
  onClose: _onClose, // Unused but kept for interface compatibility if needed in future
  children,
  className,
  testId,
}: SlideOverPanelProps): React.JSX.Element => {
  return (
    <div
      data-testid={testId}
      aria-hidden={!isOpen}
      className={cn(
        'absolute inset-0 flex flex-col z-50 bg-background text-foreground',
        'transition-[transform,opacity] duration-300 ease-in-out',
        isOpen
          ? 'translate-x-0 shadow-lg opacity-100'
          : 'translate-x-[calc(100%+8px)] shadow-none opacity-0 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
};
