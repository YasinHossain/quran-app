// app/surah/[surahId]/_components/Verse.tsx
import { FaPlay, FaPause, FaBookmark, FaEllipsisH, FaBookReader } from '@/app/components/SvgIcons'; // Added FaBookReader back

interface VerseProps {
  verse: any;
  playingId: number | null;
  onPlayToggle: (id: number) => void;
  arabicFontFace: string;
  arabicFontSize: number;
  translationFontSize: number;
}

export const Verse = ({ verse, playingId, onPlayToggle, arabicFontFace, arabicFontSize, translationFontSize }: VerseProps) => {
  const isPlaying = playingId === verse.id;

  return (
    <div className="flex items-start gap-x-6 mb-12 border-b pb-8 border-gray-200">
      <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
        <p className="font-semibold text-teal-600 text-sm">{verse.verse_key}</p>
        <div className="flex flex-col items-center space-y-1 text-gray-400">
          <button onClick={() => onPlayToggle(verse.id)} title="Play/Pause" className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'}`}>
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <button title="Bookmark" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaBookmark size={18} /></button>
          
          {/* This is the Tafsir icon that was missing */}
          <button title="Tafsir" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaBookReader size={18} /></button>
          
          <button title="More" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-teal-600 transition"><FaEllipsisH size={18} /></button>
        </div>
      </div>
      <div className="flex-grow space-y-6">
        <p className="text-right leading-loose text-gray-800" style={{ fontFamily: arabicFontFace, fontSize: `${arabicFontSize}px`, lineHeight: 2.2 }}>
          {verse.text_uthmani}
        </p>
        {verse.translations?.map((t: any) => (
          <div key={t.resource_id}>
            <p className="text-left leading-relaxed text-gray-600" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: t.text }} />
          </div>
        ))}
      </div>
    </div>
  );
};