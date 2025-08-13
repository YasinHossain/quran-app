'use client';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import VerseActions from '@/app/shared/VerseActions';
import VerseArabic from '@/app/shared/VerseArabic';
import { TafsirPanels } from './TafsirPanels';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

interface TafsirVerseProps {
  verse: VerseType;
  tafsirIds: number[];
}

export const TafsirVerse = ({ verse, tafsirIds }: TafsirVerseProps) => {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();

  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-x-6 pb-8 border-b border-[var(--border-color)]">
        <VerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isBookmarked}
          onPlayPause={() =>
            setPlayingId((currentId) => (currentId === verse.id ? null : verse.id))
          }
          onBookmark={() => toggleBookmark(String(verse.id))}
          className="w-16 pt-1"
        />
        <div className="flex-grow space-y-6">
          <VerseArabic verse={verse} />
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed text-[var(--foreground)]"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }}
              />
            </div>
          ))}
        </div>
      </div>
      <TafsirPanels verseKey={verse.verse_key} tafsirIds={tafsirIds} />
    </div>
  );
};
