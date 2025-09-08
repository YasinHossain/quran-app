'use client';

import { useSettings } from '@/app/providers/SettingsContext';
import { VerseArabic } from '@/app/shared/VerseArabic';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { Translation, Verse as VerseType } from '@/types';

interface VerseContentProps {
  verse: VerseType;
}

export function VerseContent({ verse }: VerseContentProps): JSX.Element {
  const { settings } = useSettings();

  return (
    <div className="space-y-6 md:flex-grow">
      <VerseArabic verse={verse} />
      {verse.translations?.map((t: Translation) => (
        <div key={t.resource_id}>
          <p
            className="text-left leading-relaxed"
            style={{ fontSize: `${settings.translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
          />
        </div>
      ))}
    </div>
  );
}
