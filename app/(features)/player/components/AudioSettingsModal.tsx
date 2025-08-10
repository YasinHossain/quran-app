'use client';
import { useState } from 'react';
import { FaTimes } from '@/app/shared/SvgIcons';
import { useAudio, RepeatOptions } from '@/app/(features)/player/context/AudioContext';
import { RECITERS } from '@/lib/audio/reciters';
import { useTranslation } from 'react-i18next';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioSettingsModal({ isOpen, onClose }: AudioSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'repeat' | 'reciter'>('repeat');
  const { repeatOptions, setRepeatOptions, reciter, setReciter } = useAudio();
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const handleChange = (field: keyof RepeatOptions, value: string | number) => {
    setRepeatOptions({ ...repeatOptions, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-[var(--background)] p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              className={`pb-1 border-b-2 ${activeTab === 'repeat' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('repeat')}
            >
              {t('repeat')}
            </button>
            <button
              className={`pb-1 border-b-2 ${activeTab === 'reciter' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('reciter')}
            >
              {t('reciter')}
            </button>
          </div>
          <button
            aria-label={t('close')}
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <FaTimes size={16} />
          </button>
        </div>
        {activeTab === 'repeat' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="repeat-mode">
                {t('mode')}
              </label>
              <select
                id="repeat-mode"
                value={repeatOptions.mode}
                onChange={(e) => handleChange('mode', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
              >
                <option value="single">{t('single_verse')}</option>
                <option value="range">{t('verse_range')}</option>
                <option value="surah">{t('full_surah')}</option>
              </select>
            </div>
            {repeatOptions.mode !== 'surah' && (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm" htmlFor="repeat-start">
                      {t('start')}
                    </label>
                    <input
                      id="repeat-start"
                      type="number"
                      min={1}
                      value={repeatOptions.start}
                      onChange={(e) => handleChange('start', parseInt(e.target.value, 10))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm" htmlFor="repeat-end">
                      {t('end')}
                    </label>
                    <input
                      id="repeat-end"
                      type="number"
                      min={repeatOptions.start}
                      value={repeatOptions.end}
                      onChange={(e) => handleChange('end', parseInt(e.target.value, 10))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm" htmlFor="repeat-playcount">
                      {t('play_count')}
                    </label>
                    <input
                      id="repeat-playcount"
                      type="number"
                      min={1}
                      value={repeatOptions.playCount}
                      onChange={(e) => handleChange('playCount', parseInt(e.target.value, 10))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm" htmlFor="repeat-each">
                      {t('repeat_each')}
                    </label>
                    <input
                      id="repeat-each"
                      type="number"
                      min={1}
                      value={repeatOptions.repeatEach}
                      onChange={(e) => handleChange('repeatEach', parseInt(e.target.value, 10))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm" htmlFor="repeat-delay">
                    {t('delay_seconds')}
                  </label>
                  <input
                    id="repeat-delay"
                    type="number"
                    min={0}
                    value={repeatOptions.delay}
                    onChange={(e) => handleChange('delay', parseInt(e.target.value, 10))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
                  />
                </div>
              </div>
            )}
            {repeatOptions.mode === 'surah' && (
              <p className="text-sm">{t('play_entire_surah_continuously')}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('search_reciter')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm"
            />
            <ul className="max-h-48 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
              {RECITERS.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())).map(
                (r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setReciter(r)}
                      className={
                        'w-full text-left p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ' +
                        (reciter.id === r.id ? 'bg-teal-100 dark:bg-teal-800' : '')
                      }
                    >
                      {r.name}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
