'use client';

import React from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

import type { Verse as VerseType, Translation } from '@/types';

interface VerseTranslationsProps {
  verse: VerseType;
}
export function VerseTranslations({ verse }: VerseTranslationsProps): React.JSX.Element | null {
  const { settings } = useSettings();
  if (!verse.translations?.length) return null;

  return (
    <div className="space-y-4">
      {verse.translations.map((t: Translation) => (
        <div key={t.resource_id}>
          <p
            className="text-left leading-relaxed text-foreground"
            style={{ fontSize: `${settings.translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
          />
        </div>
      ))}
    </div>
  );
}
