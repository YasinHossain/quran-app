export function EmptyState({ t }: { t: (key: string) => string }): React.JSX.Element {
  return (
    <div className="text-center py-12 md:py-20 text-muted">
      <p className="text-sm md:text-base">{t('no_verses_found_on_page')}</p>
    </div>
  );
}
