'use client';
import {
  FaPlay,
  FaPause,
  FaBookmark,
  FaRegBookmark,
  FaShare,
  FaChevronDown,
} from '@/app/shared/SvgIcons';
import { Verse as VerseType, Translation, Word } from '@/types';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useAudio } from '@/app/(features)/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useState } from 'react';
import Spinner from '@/app/shared/Spinner';
import { applyTajweed } from '@/lib/text/tajweed';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

interface TafsirVerseProps {
  verse: VerseType;
  tafsirIds: number[];
}

export const TafsirVerse = ({ verse, tafsirIds }: TafsirVerseProps) => {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();
  const [openPanels, setOpenPanels] = useState<Record<number, boolean>>({});
  const [tafsirTexts, setTafsirTexts] = useState<Record<number, string>>({});
  const [loadingTafsir, setLoadingTafsir] = useState<Record<number, boolean>>({});

  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id));

  const togglePanel = async (id: number) => {
    setOpenPanels((p) => ({ ...p, [id]: !p[id] }));
    if (!openPanels[id] && !tafsirTexts[id]) {
      setLoadingTafsir((l) => ({ ...l, [id]: true }));
      try {
        const text = await getTafsirCached(verse.verse_key, id);
        setTafsirTexts((t) => ({ ...t, [id]: text }));
      } catch {
        setTafsirTexts((t) => ({ ...t, [id]: 'Error loading tafsir.' }));
      } finally {
        setLoadingTafsir((l) => ({ ...l, [id]: false }));
      }
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator.share({ title: 'Quran', url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {' '}
      <div className="flex items-start gap-x-6 pb-8 border-b border-[var(--border-color)]">
        {' '}
        <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
          <p className="font-semibold text-teal-600 text-sm">{verse.verse_key}</p>{' '}
          <div className="flex flex-col items-center space-y-1 text-gray-400 dark:text-gray-500">
            {' '}
            <button
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              onClick={() =>
                setPlayingId((currentId) => (currentId === verse.id ? null : verse.id))
              }
              title="Play"
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
            >
              {' '}
              {isLoadingAudio ? (
                <Spinner className="h-4 w-4 text-teal-600" />
              ) : isPlaying ? (
                <FaPause size={18} />
              ) : (
                <FaPlay size={18} />
              )}{' '}
            </button>{' '}
            <button
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              title="Bookmark"
              onClick={() => toggleBookmark(String(verse.id))}
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isBookmarked ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
            >
              {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}{' '}
            </button>{' '}
            <button
              aria-label="Share"
              title="Share"
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <FaShare size={18} />{' '}
            </button>{' '}
          </div>{' '}
        </div>{' '}
        <div className="flex-grow space-y-6">
          {' '}
          <p
            dir="rtl"
            className="text-right leading-loose text-[var(--foreground)]"
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
                          __html: settings.tajweed ? applyTajweed(word.uthmani) : word.uthmani,
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
              <span dangerouslySetInnerHTML={{ __html: applyTajweed(verse.text_uthmani) }} />
            ) : (
              verse.text_uthmani
            )}{' '}
          </p>{' '}
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              {' '}
              <p
                className="text-left leading-relaxed text-[var(--foreground)]"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: t.text }}
              />{' '}
            </div>
          ))}{' '}
        </div>{' '}
      </div>{' '}
      {tafsirIds.map((id) => {
        const open = !!openPanels[id];
        return (
          <div key={id} className="border-b border-[var(--border-color)] last:border-none">
            {' '}
            <button
              onClick={() => togglePanel(id)}
              className="w-full flex items-center justify-between py-3 text-left"
            >
              {' '}
              <span className="font-semibold text-[var(--foreground)]">Tafsir {id}</span>{' '}
              <FaChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />{' '}
            </button>{' '}
            <div
              className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              {' '}
              <div className="overflow-hidden">
                {' '}
                <div className="bg-teal-50 dark:bg-slate-800 rounded-md p-4 max-h-64 overflow-y-auto">
                  {' '}
                  {loadingTafsir[id] ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="h-5 w-5 text-teal-600" />{' '}
                    </div>
                  ) : (
                    <div
                      className="prose max-w-none text-[var(--foreground)] whitespace-pre-wrap"
                      style={{
                        fontSize: `${settings.tafsirFontSize}px`,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: applyArabicFont(tafsirTexts[id] || '', settings.arabicFontFace),
                      }}
                    />
                  )}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        );
      })}{' '}
    </div>
  );
};
