'use client';

/**
 * Empty state when no surahs match the search query
 * Shows a message to the user
 */
export function SurahEmptyState(): React.JSX.Element {
  return (
    <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
      <p className="text-content-muted">No Surahs found for your search.</p>
    </div>
  );
}
