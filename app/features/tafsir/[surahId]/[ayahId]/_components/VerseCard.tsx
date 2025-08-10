'use client';
import {
  FaPlay,
  FaPause,
  FaBookmark,
  FaRegBookmark,
  FaShare,
} from '@/app/components/shared/SvgIcons';
import { Verse as VerseType, Translation, Word } from '@/types';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useAudio } from '@/app/features/player/context/AudioContext';
import { useSettings } from '@/app/context/SettingsContext';
import Spinner from '@/app/components/shared/Spinner';
import { applyTajweed } from '@/lib/text/tajweed';
import DOMPurify from 'dompurify';

interface VerseCardProps {
  verse: VerseType;
}

export default function VerseCard({ verse }: VerseCardProps) {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();

  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator.share({ title: 'Quran', url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  return (
    <div className="relative flex bg-white rounded-md border shadow p-6">
      {' '}
      <span className="absolute -top-3 left-4 bg-slate-100 text-xs px-3 py-0.5 rounded-full">
        {verse.verse_key}{' '}
      </span>{' '}
      <div className="w-14 flex flex-col items-center space-y-2 mr-4 pt-2 text-gray-500">
        {' '}
        <button
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          onClick={() => setPlayingId((id) => (id === verse.id ? null : verse.id))}
          className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isPlaying ? 'text-emerald-600' : 'hover:text-emerald-600'}`}
        >
          {' '}
          {isLoadingAudio ? (
            <Spinner className="h-4 w-4 text-emerald-600" />
          ) : isPlaying ? (
            <FaPause size={18} />
          ) : (
            <FaPlay size={18} />
          )}{' '}
        </button>{' '}
        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onClick={() => toggleBookmark(String(verse.id))}
          className={`p-1.5 rounded-full hover:bg-gray-100 transition ${isBookmarked ? 'text-emerald-600' : 'hover:text-emerald-600'}`}
        >
          {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}{' '}
        </button>{' '}
        <button
          aria-label="Share"
          onClick={handleShare}
          className="p-1.5 rounded-full hover:bg-gray-100 hover:text-emerald-600 transition"
        >
          <FaShare size={18} />{' '}
        </button>{' '}
      </div>{' '}
      <div className="flex-grow space-y-6">
        {' '}
        <p
          dir="rtl"
          className="text-right leading-loose"
          style={{
            fontFamily: settings.arabicFontFace,
            fontSize: `${settings.arabicFontSize}px`,
            lineHeight: 2.2,
          }}
        >
          {' '}
          {verse.words && verse.words.length > 0 ? (
            <span className="flex flex-wrap gap-x-1 gap-y-1 justify-start">
              {' '}
              {verse.words.map((word: Word) => (
                <span key={word.id} className="text-center">
                  {' '}
                  <span className="relative group cursor-pointer inline-block">
                    {' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          settings.tajweed ? applyTajweed(word.uthmani) : word.uthmani
                        ),
                      }}
                    />{' '}
                    {!showByWords && (
                      <span className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                        {word[wordLang as LanguageCode] as string}{' '}
                      </span>
                    )}{' '}
                  </span>{' '}
                  {showByWords && (
                    <span
                      className="mt-0.5 block text-gray-500 mx-1"
                      style={{ fontSize: `${settings.arabicFontSize * 0.5}px` }}
                    >
                      {word[wordLang as LanguageCode] as string}{' '}
                    </span>
                  )}{' '}
                </span>
              ))}{' '}
            </span>
          ) : settings.tajweed ? (
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(applyTajweed(verse.text_uthmani)),
              }}
            />
          ) : (
            verse.text_uthmani
          )}{' '}
        </p>{' '}
        {verse.translations?.map((t: Translation) => (
          <div key={t.resource_id}>
            {' '}
            <p
              className="text-left leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t.text) }}
            />{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
