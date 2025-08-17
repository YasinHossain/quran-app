import React from 'react';

interface Tab {
  key: 'Surah' | 'Juz' | 'Page';
  label: string;
}

import type { Theme } from '@/app/providers/ThemeContext';
import { themeClass } from '@/lib/utils/themeClass';

interface Props {
  tabs: Tab[];
  activeTab: 'Surah' | 'Juz' | 'Page';
  setActiveTab: (tab: 'Surah' | 'Juz' | 'Page') => void;
  prepareForTabSwitch: (tab: 'Surah' | 'Juz' | 'Page') => void;
  theme: Theme;
}

const SidebarTabs = ({ tabs, activeTab, setActiveTab, prepareForTabSwitch, theme }: Props) => (
  <div
    className={`flex items-center p-1 rounded-full ${themeClass(
      theme,
      'bg-gray-100',
      'bg-slate-800/60'
    )}`}
  >
    {tabs.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => {
          prepareForTabSwitch(key);
          setActiveTab(key);
        }}
        className={`w-1/3 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeTab === key
            ? themeClass(theme, 'bg-white text-slate-900 shadow', 'bg-slate-700 text-white shadow')
            : themeClass(
                theme,
                'text-slate-400 hover:text-slate-700',
                'text-slate-400 hover:text-white'
              )
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default SidebarTabs;
