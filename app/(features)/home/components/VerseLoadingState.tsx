'use client';

import { Spinner } from '@/app/shared/Spinner';

interface VerseLoadingStateProps {
  className?: string;
}

/**
 * Loading state component for verse display
 * Used when verse data is being fetched
 */
export function VerseLoadingState({ className }: VerseLoadingStateProps): React.JSX.Element {
  return (
    <div
      className={`mt-8 md:mt-12 w-full max-w-xl md:max-w-4xl p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60 ${className || ''}`}
    >
      <div className="flex justify-center py-6 md:py-8">
        <Spinner className="h-5 w-5 md:h-6 md:w-6 text-accent" />
      </div>
    </div>
  );
}
