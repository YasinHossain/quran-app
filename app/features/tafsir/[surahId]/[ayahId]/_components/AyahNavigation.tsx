'use client';
import { FaChevronDown } from '@/app/components/common/SvgIcons';

interface AyahNavigationProps {
  surahName: string;
  verseNumber: number;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function AyahNavigation({
  surahName,
  verseNumber,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: AyahNavigationProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-md border shadow">
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous"
        className="p-2 text-gray-500 hover:text-emerald-600 disabled:opacity-50"
      >
        <FaChevronDown className="rotate-90" />
      </button>
      <div className="text-center">
        <p className="font-bold text-lg text-gray-800">{surahName}</p>
        <p className="text-sm text-gray-500">Verse {verseNumber}</p>
      </div>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
        className="p-2 text-gray-500 hover:text-emerald-600 disabled:opacity-50"
      >
        <FaChevronDown className="-rotate-90" />
      </button>
    </div>
  );
}
