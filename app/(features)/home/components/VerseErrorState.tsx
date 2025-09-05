'use client';

interface VerseErrorStateProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

/**
 * Error state component for verse display
 * Shows error message with retry button
 */
export function VerseErrorState({ error, onRetry, className }: VerseErrorStateProps) {
  return (
    <div
      className={`mt-8 md:mt-12 w-full max-w-xl md:max-w-4xl p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg backdrop-blur-xl content-visibility-auto animate-fade-in-up animation-delay-400 bg-surface-glass/60 ${className || ''}`}
    >
      <div className="text-center py-6 md:py-8 space-y-4">
        <p className="text-status-error text-sm md:text-base">{error}</p>
        <button
          onClick={onRetry}
          className="min-h-11 px-4 py-2 bg-accent text-on-accent rounded-lg hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 touch-manipulation"
          aria-label="Retry loading verse"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
