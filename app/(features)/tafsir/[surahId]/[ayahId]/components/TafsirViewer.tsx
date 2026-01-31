'use client';
import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import { useSettings } from '@/app/providers/SettingsContext';
import { Verse as VerseType, TafsirResource } from '@/types';

import { TafsirTabs } from './TafsirTabs';

interface TafsirViewerProps {
  verse?: VerseType;
  tafsirResource?: TafsirResource;
  tafsirHtml?: string;
  onAddTafsir?: (() => void) | undefined;
}

export const TafsirViewer = ({
  verse,
  tafsirResource,
  tafsirHtml,
  onAddTafsir,
}: TafsirViewerProps): React.JSX.Element | null => {
  const { settings } = useSettings();

  if (!verse) return null;

  // Show TafsirTabs when we have tafsirs AND (we have multiple OR onAddTafsir is provided)
  const showTabs =
    settings.tafsirIds &&
    settings.tafsirIds.length >= 1 &&
    (settings.tafsirIds.length > 1 || onAddTafsir);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-4"></div>
      <VerseComponent verse={verse} />
      {showTabs ? (
        <TafsirTabs
          verseKey={verse.verse_key}
          tafsirIds={settings.tafsirIds}
          onAddTafsir={onAddTafsir}
        />
      ) : settings.tafsirIds && settings.tafsirIds.length === 1 ? (
        <div key={verse.verse_key} className="p-3 sm:p-4">
          {tafsirResource && (
            <h2 className="mb-4 text-center text-lg sm:text-xl font-bold text-foreground">
              {tafsirResource.name}
            </h2>
          )}
          <div
            className="prose max-w-none tafsir-content break-words"
            style={{ fontSize: `${settings.tafsirFontSize || 18}px` }}
            dangerouslySetInnerHTML={{ __html: tafsirHtml || '' }}
          />
        </div>
      ) : (
        <div className="p-4 text-center text-muted">
          Please select a tafsir from the settings panel to view commentary.
        </div>
      )}
    </div>
  );
};
