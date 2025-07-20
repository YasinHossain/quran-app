// app/components/SurahListSidebar.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaSearch } from './SvgIcons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';

const SurahListSidebar = () => {
  const { t } = useTranslation();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Surah');
  const params = useParams();
  const activeSurahId = params.surahId;

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(err => console.error('Failed to fetch chapters:', err));
  }, []);

  const filteredChapters = useMemo(() =>
    chapters.filter(chapter =>
      chapter.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.id.toString().includes(searchTerm)
    ), [chapters, searchTerm]
  );

  return (
    <aside className="w-80 bg-[#F0FAF8] flex flex-col flex-shrink-0 shadow-[5px_0px_15px_-5px_rgba(0,0,0,0.05)] z-10">
      <div className="p-4 border-b border-gray-200/80">
        <div className="flex bg-gray-200 rounded-full p-1">
          {[t('surah_tab'), t('juz_tab'), t('page_tab')].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === tab ? 'bg-white text-teal-700 shadow' : 'text-gray-600 hover:bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-b border-gray-200/80">
        <div className="relative">
          <FaSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_surah')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200/80 rounded-lg py-2 pl-9 pr-3 focus:ring-2 focus:ring-teal-500 outline-none transition"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        {activeTab === 'Surah' ? (
          <nav className="space-y-1">
            {filteredChapters.map(chapter => {
              const isActive = activeSurahId === String(chapter.id);
              return (
                <Link href={`/features/surah/${chapter.id}`} key={chapter.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'bg-teal-50' : 'hover:bg-white'
                  }`}>
                    {/* CHANGE: Replaced the diamond with a modern, rounded square ("squircle") */}
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <span>{chapter.id}</span>
                    </div>

                    <div className="flex-grow">
                      <p className={`font-semibold ${isActive ? 'text-teal-800' : 'text-gray-800'}`}>{chapter.name_simple}</p>
                      <p className="text-xs text-gray-500">{chapter.revelation_place}</p>
                    </div>

                    <p className={`font-mono text-xl ${isActive ? 'text-teal-800' : 'text-gray-500'}`}>
                      {chapter.name_arabic}
                    </p>
                </Link>
              )
            })}
          </nav>
        ) : (
            <div className="p-6 text-center text-gray-500">
                {t('view_not_implemented', { tab: activeTab })}
            </div>
        )}
      </div>
    </aside>
  );
};

export default SurahListSidebar;
