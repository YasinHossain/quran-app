'use client';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/presentation/shared/player/context/AudioContext';
import { useSettings } from '@/presentation/providers/SettingsContext';
import { useBookmarks } from '@/presentation/providers/BookmarkContext';
import ResponsiveVerseActions from '@/presentation/shared/ResponsiveVerseActions';
import VerseArabic from '@/presentation/shared/VerseArabic';
import { TafsirPanels } from './TafsirPanels';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

interface TafsirVerseProps {
  verse: VerseType;
  tafsirIds: number[];
}

export const TafsirVerse = ({ verse, tafsirIds }: TafsirVerseProps) => {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings } = useSettings();
  const { bookmarkedVerses, toggleBookmark } = useBookmarks();

  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

  return (
    <div className="space-y-6">
      {/* Mobile: stacked layout, Desktop: side-by-side */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6 pb-8 border-b border-border">
        {/* Verse actions */}
        <ResponsiveVerseActions
          verseKey={verse.verse_key}
          isPlaying={isPlaying}
          isLoadingAudio={isLoadingAudio}
          isBookmarked={isBookmarked}
          onPlayPause={() =>
            setPlayingId((currentId) => (currentId === verse.id ? null : verse.id))
          }
          onBookmark={() => toggleBookmark(String(verse.id))}
          className="md:w-16 md:pt-1"
        />

        {/* Main content area */}
        <div className="space-y-6 md:flex-grow">
          <VerseArabic verse={verse} />
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed text-foreground"
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
