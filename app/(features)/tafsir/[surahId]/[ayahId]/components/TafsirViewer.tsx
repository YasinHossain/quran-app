'use client';
import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import { useSettings } from '@/app/providers/SettingsContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { settings } = useSettings();

  if (!verse) return null;

  const tafsirIds = settings.tafsirIds ?? [];
  const hasSelectedTafsir = tafsirIds.length >= 1;
  const showTabs = tafsirIds.length > 1;

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-4"></div>
      <VerseComponent verse={verse} />
      {showTabs ? (
        <TafsirTabs
          verseKey={verse.verse_key}
          tafsirIds={tafsirIds}
          onAddTafsir={onAddTafsir}
        />
      ) : hasSelectedTafsir ? (
        <div key={verse.verse_key} className="p-3 sm:p-4">
          <div className="flex flex-col items-center gap-3 mb-4">
            {tafsirResource && (
              <h2 className="text-center text-lg sm:text-xl font-bold text-foreground">
                {tafsirResource.name}
              </h2>
            )}
            {onAddTafsir && (
              <button
                type="button"
                onClick={onAddTafsir}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-interactive-hover transition-colors"
              >
                {t('add_tafsir')}
              </button>
            )}
          </div>
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
