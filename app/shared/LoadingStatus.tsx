import React from 'react';

import { cn } from '@/lib/utils/cn';

type LoadingStatusProps = {
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

export function LoadingStatus({
  label = 'Loading',
  className,
  children,
}: LoadingStatusProps): React.JSX.Element {
  return (
    <div role="status" aria-label={label} className={cn('w-full', className)}>
      {children}
    </div>
  );
}

