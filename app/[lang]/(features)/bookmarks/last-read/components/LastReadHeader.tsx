'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { ClockIcon } from '@/app/shared/icons';

export const LastReadHeader = (): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <ClockIcon size={20} className="text-on-accent" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">
            {t('binder_tab_recent', { defaultValue: 'Recent' })}
          </h1>
          <p className="text-xs text-muted">
            {t('binder_tab_recent_desc', { defaultValue: 'Last visited' })}
          </p>
        </div>
      </div>
    </div>
  );
};
