'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

interface ChildrenSectionProps {
  children?: React.ReactNode;
  title?: string | null;
  containerClassName?: string;
  contentClassName?: string;
}

export const ChildrenSection = ({
  children,
  title,
  containerClassName,
  contentClassName,
}: ChildrenSectionProps): React.JSX.Element | null => {
  if (!children) return null;

  const heading = title === undefined ? 'More' : title;

  return (
    <div className={cn('mt-6 pt-4 border-t border-border', containerClassName)}>
      {heading !== null ? (
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
          {heading}
        </div>
      ) : null}
      <div className={cn('space-y-1', contentClassName)}>{children}</div>
    </div>
  );
};
