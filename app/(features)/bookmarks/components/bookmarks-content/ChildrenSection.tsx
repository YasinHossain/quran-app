'use client';

import React from 'react';

interface ChildrenSectionProps {
  children?: React.ReactNode;
}

export const ChildrenSection = ({ children }: ChildrenSectionProps): React.JSX.Element | null => {
  if (!children) return null;

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
        More
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
};
