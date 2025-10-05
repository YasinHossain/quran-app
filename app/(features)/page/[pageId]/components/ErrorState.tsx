export function ErrorState({ error }: { error: string }): React.JSX.Element {
  return (
    <div className="text-center py-12 md:py-20 text-status-error bg-surface border border-status-error/20 p-4 md:p-6 rounded-lg mx-2 md:mx-0">
      <p className="text-sm md:text-base">{error}</p>
    </div>
  );
}
