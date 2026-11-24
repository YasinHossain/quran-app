'use client';

/**
 * Empty state when no surahs match the search query
 * Shows a message to the user
 */
import { useTranslation } from 'react-i18next';

export function SurahEmptyState(): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
      <p className="text-content-muted">{t('home_no_surahs_found')}</p>
    </div>
  );
}
