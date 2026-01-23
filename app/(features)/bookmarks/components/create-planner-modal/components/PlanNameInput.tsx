'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { UnifiedInput } from '@/app/shared/ui/inputs/UnifiedInput';
import { formatNumber } from '@/lib/text/localizeNumbers';

interface PlanNameInputProps {
  planName: string;
  onChange: (planName: string) => void;
  errorMessage?: string;
}

export const PlanNameInput = ({
  planName,
  onChange,
  errorMessage,
}: PlanNameInputProps): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const hasError = Boolean(errorMessage);
  const inputId = 'plan-name';
  const currentLength = formatNumber(planName.length, i18n.language, { useGrouping: false });
  const maxLengthLabel = formatNumber(50, i18n.language, { useGrouping: false });

  return (
    <UnifiedInput
      id={inputId}
      label={t('planner_set_plan_name')}
      type="text"
      value={planName}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('planner_enter_plan_name')}
      maxLength={50}
      rightSlot={
        <span className="text-muted text-sm">
          {currentLength}/{maxLengthLabel}
        </span>
      }
      {...(hasError ? { errorMessage } : {})}
    />
  );
};
