'use client';

/**
 * Loading state for the surah grid
 * Shows a spinner centered in the grid layout
 */
export function SurahLoadingGrid(): React.JSX.Element {
  return (
    <div className="flex justify-center py-10 col-span-full">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
    </div>
  );
}
