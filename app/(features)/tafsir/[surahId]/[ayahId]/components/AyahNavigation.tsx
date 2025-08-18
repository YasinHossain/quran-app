'use client';
import { Surah } from '@/types';

interface NavTarget {
  surahId: string;
  ayahId: number;
}

interface AyahNavigationProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  navigate: (target: NavTarget | null) => void;
  currentSurah?: Surah;
  ayahId: string;
}

export const AyahNavigation = ({
  prev,
  next,
  navigate,
  currentSurah,
  ayahId,
}: AyahNavigationProps) => (
  <div className="flex items-center justify-between rounded-full bg-accent text-on-accent p-2">
    <button
      aria-label="Previous"
      disabled={!prev}
      onClick={() => navigate(prev)}
      className="flex items-center px-4 py-2 rounded-full bg-accent text-on-accent disabled:opacity-50 font-bold"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.707 15.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L8.414 10l3.293 3.293a1 1 0 001.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
    <div className="text-on-accent font-bold">
      {currentSurah ? (
        <>
          <span className="font-bold">{currentSurah.name}</span> : {ayahId}
        </>
      ) : (
        ''
      )}
    </div>
    <button
      aria-label="Next"
      disabled={!next}
      onClick={() => navigate(next)}
      className="flex items-center px-4 py-2 rounded-full bg-accent text-on-accent disabled:opacity-50 font-bold"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 10l-3.293-3.293a1 1 0 00-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  </div>
);

export default AyahNavigation;
