// app/surah/[surahId]/_components/Verse.tsx
import { FaPlay, FaPause, FaBookmark, FaRegBookmark, FaEllipsisH, FaBookReader } from '@/app/components/common/SvgIcons';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/context/AudioContext';
import { useSettings } from '@/app/context/SettingsContext';

interface VerseProps {
  verse: VerseType;
}

export const Verse = ({ verse }: VerseProps) => {
  const { playingId, setPlayingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings(); // Get bookmarkedVerses and toggleBookmark
  const isPlaying = playingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id)); // Check if verse is bookmarked

  return (
    <div className="flex items-start gap-x-6 mb-12 border-b pb-8 border-gray-200">
      <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
        <p className="font-semibold text-teal-600 text-sm">{verse.verse_key}</p>
        <div className="flex flex-col items-center space-y-1 text-gray-400">
          <button
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            onClick={() =>
              setPlayingId(currentId => (currentId === verse.id ? null : verse.id))
            }
            title="Play/Pause"
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          {/* Bookmark button */}
          <button
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            title="Bookmark"
            onClick={() => toggleBookmark(String(verse.id))}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isBookmarked ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
          >
            {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />} {/* Change icon based on bookmark status */}
          </button>
          
          {/* This is the Tafsir icon that was missing */}
          <button
            aria-label="Tafsir"
            title="Tafsir"
            className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaBookReader size={18} />
          </button>

          <button
            aria-label="More options"
            title="More"
            className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaEllipsisH size={18} />
          </button>
        </div>
      </div>
      <div className="flex-grow space-y-6">
        <p
          className="text-right leading-loose text-gray-800"
          style={{ fontFamily: settings.arabicFontFace, fontSize: `${settings.arabicFontSize}px`, lineHeight: 2.2 }}
        >
          {verse.text_uthmani}
        </p>
        {verse.translations?.map((t: Translation) => (
          <div key={t.resource_id}>
            <p
              className="text-left leading-relaxed text-gray-600"
              style={{ fontSize: `${settings.translationFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: t.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
