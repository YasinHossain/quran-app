'use client';

export function OfflineActions(): React.JSX.Element {
  const refreshPage = (): void => window.location.reload();
  const goBack = (): void => window.history.back();

  return (
    <div className="w-full space-y-4">
      <button
        type="button"
        onClick={refreshPage}
        className="w-full rounded-lg bg-accent px-6 py-3 font-medium text-on-accent transition-colors hover:bg-accent-hover"
      >
        Try Again
      </button>
      <button
        type="button"
        onClick={goBack}
        className="w-full rounded-lg border border-border bg-interactive px-6 py-3 font-medium text-foreground transition-colors hover:bg-interactive-hover"
      >
        Go Back
      </button>
    </div>
  );
}
