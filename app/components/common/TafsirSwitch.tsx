'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface TafsirSwitchProps {
  tafsirs: { id: number; name: string }[];
  activeId: number;
  verseKey: string;
}

export default function TafsirSwitch({ tafsirs, activeId, verseKey }: TafsirSwitchProps) {
  const router = useRouter();

  const handleSwitchTafsir = (id: number) => {
    const [surahId, ayahId] = verseKey.split(':');
    // Construct the new URL with the correct route prefix
    const newPath = `/features/tafsir/${surahId}/${ayahId}?tafsir=${id}`;
    router.push(newPath);
  };

  return (
    <div className="flex w-full p-1 rounded-full bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 ml-4">
      {tafsirs.map((tafsir) => (
        <button
          key={tafsir.id}
          onClick={() => handleSwitchTafsir(tafsir.id)}
          className={`flex-1 text-center py-3 px-5 rounded-full transition-colors focus:outline-none ${
            activeId === tafsir.id
              ? 'bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100'
              : 'bg-gray-300 text-gray-600 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-slate-600'
          }`}
        >
          {tafsir.name}
        </button>
      ))}
    </div>
  );
}
