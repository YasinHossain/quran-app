'use client';

import { useTranslation } from 'react-i18next';

import { localizeDigits } from '@/lib/text/localizeNumbers';

interface EmptyPlannerStateProps {
  verseLabel: string;
}

export function EmptyPlannerState({ verseLabel }: EmptyPlannerStateProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const localizedVerseLabel = localizeDigits(verseLabel, i18n.language);

  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <p className="text-base font-semibold text-content-primary">
        {t('add_to_plan_no_planners_title')}
      </p>
      <p className="mt-2 text-sm text-content-secondary">
        {t('add_to_plan_no_planners_description', {
          verse: localizedVerseLabel,
        })}
      </p>
    </div>
  );
}
