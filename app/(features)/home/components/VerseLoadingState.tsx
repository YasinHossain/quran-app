'use client';

import { Spinner } from '@/app/shared/Spinner';

interface VerseLoadingStateProps {
  className?: string | undefined;
}

/**
 * Loading state component for verse display
 * Used when verse data is being fetched
 */
export function VerseLoadingState({ className }: VerseLoadingStateProps): React.JSX.Element {
  return (
    <div
      className={`w-full p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg bg-surface-navigation border border-border/30 dark:border-border/20 min-h-[200px] flex items-center justify-center ${className || ''
        }`}
    >
      <Spinner className="h-6 w-6 md:h-8 md:w-8 text-accent" />
    </div>
  );
}
