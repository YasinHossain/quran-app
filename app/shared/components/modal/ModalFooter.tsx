'use client';

import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

export interface ModalFooterProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const ModalFooter = memo(function ModalFooter({
  left,
  right,
  className,
}: ModalFooterProps): React.JSX.Element | null {
  if (!left && !right) return null;

  const justifyClass = left && right ? 'justify-between' : 'justify-end';

  return (
    <div className={cn('flex items-center gap-3', justifyClass, className)}>
      {left ? <div className="flex items-center gap-2">{left}</div> : null}
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
});
