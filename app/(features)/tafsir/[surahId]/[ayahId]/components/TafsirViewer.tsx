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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4"></div>
      <VerseComponent verse={verse} />
      {settings.tafsirIds.length > 1 ? (
        <TafsirTabs verseKey={verse.verse_key} tafsirIds={settings.tafsirIds} />
      ) : (
        tafsirResource && (
          <div key={verse.verse_key} className="p-4">
            <h2 className="mb-4 text-center text-xl font-bold text-[var(--foreground)]">
              {tafsirResource.name}
            </h2>
            <div
              className="prose max-w-none whitespace-pre-wrap"
              style={{ fontSize: `${settings.tafsirFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: tafsirHtml || '' }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default TafsirViewer;
