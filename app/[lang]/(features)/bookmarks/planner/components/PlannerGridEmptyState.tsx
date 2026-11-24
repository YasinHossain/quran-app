'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarIcon } from '@/app/shared/icons';

export const PlannerGridEmptyState = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <CalendarIcon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{t('planner_empty_title')}</h3>
      <p className="text-muted max-w-md mx-auto">{t('planner_empty_description')}</p>
    </div>
  );
};
