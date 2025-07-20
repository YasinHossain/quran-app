// app/surah/[surahId]/_components/Verse.tsx
import { FaPlay, FaPause, FaBookmark, FaRegBookmark, FaEllipsisH, FaBookReader } from '@/app/components/common/SvgIcons';
import { TafsirModal } from './TafsirModal';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/context/AudioContext';
import { useSettings } from '@/app/context/SettingsContext';
import { useState } from 'react';

interface VerseProps {
  verse: VerseType;
}

export const Verse = ({ verse }: VerseProps) => {
  const { playingId, setPlayingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings(); // Get bookmarkedVerses and toggleBookmark
  const [showTafsir, setShowTafsir] = useState(false);
  const isPlaying = playingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(verse.id); // Check if verse is bookmarked

  return (
    <>
    <div className="flex items-start gap-x-6 mb-12 border-b pb-8 border-gray-200">
      <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
        <p className="font-semibold text-teal-600 text-sm">{verse.verse_key}</p>
        <div className="flex flex-col items-center space-y-1 text-gray-400">
          <button
            onClick={() =>
              setPlayingId(currentId => (currentId === verse.id ? null : verse.id))
            }
            title="Play/Pause"
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'}`}
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          {/* Bookmark button */}
          <button
            title="Bookmark"
            onClick={() => toggleBookmark(verse.id)} // Call toggleBookmark on click
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isBookmarked ? 'text-teal-600' : 'hover:text-teal-600'}`}
          >
            {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />} {/* Change icon based on bookmark status */}
          </button>
          
          {/* Tafsir button opens modal */}
          <button
            title="Tafsir"
            onClick={() => setShowTafsir(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"
          >
            <FaBookReader size={18} />
          </button>
          
          <button title="More" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaEllipsisH size={18} /></button>
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
    <TafsirModal
      isOpen={showTafsir}
      verseKey={verse.verse_key}
      onClose={() => setShowTafsir(false)}
    />
    </>
  );
};
