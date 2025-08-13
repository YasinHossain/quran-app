'use client';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import VerseActions from '@/app/shared/VerseActions';
import VerseArabic from '@/app/shared/VerseArabic';

interface VerseCardProps {
  verse: VerseType;
}

export default function VerseCard({ verse }: VerseCardProps) {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();

  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

  return (
    <div className="relative flex bg-white rounded-md border shadow p-6">
      <VerseActions
        verseKey={verse.verse_key}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={() => setPlayingId((id) => (id === verse.id ? null : verse.id))}
        onBookmark={() => toggleBookmark(String(verse.id))}
        className="w-14 mr-4 pt-2 text-gray-500"
      />
      <div className="flex-grow space-y-6">
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
    </div>
  );
}
