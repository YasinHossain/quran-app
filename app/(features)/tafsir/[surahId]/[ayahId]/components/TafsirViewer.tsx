'use client';
import { Verse as VerseType, TafsirResource } from '@/types';
import { Verse as VerseComponent } from '@/app/(features)/surah/[surahId]/components/Verse';
import TafsirTabs from './TafsirTabs';
import { useSettings } from '@/app/providers/SettingsContext';

interface TafsirViewerProps {
  verse?: VerseType;
  tafsirResource?: TafsirResource;
  tafsirHtml?: string;
}

export const TafsirViewer = ({ verse, tafsirResource, tafsirHtml }: TafsirViewerProps) => {
  const { settings } = useSettings();

  if (!verse) return null;

  if (!settings) {
    return (
      <div className="space-y-4 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-hover rounded"></div>
          <div className="h-4 bg-surface-hover rounded w-3/4"></div>
          <div className="h-4 bg-surface-hover rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-4"></div>
      <VerseComponent verse={verse} />
      {settings.tafsirIds.length > 1 ? (
        <TafsirTabs verseKey={verse.verse_key} tafsirIds={settings.tafsirIds} />
      ) : settings.tafsirIds.length === 1 ? (
        <div key={verse.verse_key} className="p-3 sm:p-4">
          {tafsirResource && (
            <h2 className="mb-4 text-center text-lg sm:text-xl font-bold text-foreground">
              {tafsirResource.name}
            </h2>
          )}
          <div
            className="prose max-w-none tafsir-content break-words"
            style={{ fontSize: `${settings.tafsirFontSize}px` }}
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

export default TafsirViewer;
