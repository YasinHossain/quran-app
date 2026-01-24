'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';

interface ReaderResourceHeadingProps {
  resourceKind: MushafResourceKind;
  resourceId: string;
}

const toDisplayNumber = (value: string): string => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? String(parsed) : value;
};

export function ReaderResourceHeading({
  resourceKind,
  resourceId,
}: ReaderResourceHeadingProps): React.JSX.Element | null {
  const { t } = useTranslation();

  const label = useMemo(() => {
    if (resourceKind === 'page') return t('page');
    if (resourceKind === 'juz') return t('juz');
    return null;
  }, [resourceKind, t]);

  if (!label) return null;

  return (
    <header className="w-full">
      <h1 className="text-xl font-semibold tracking-tight">
        {label} {toDisplayNumber(resourceId)}
      </h1>
    </header>
  );
}

