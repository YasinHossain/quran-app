import React from 'react';

interface Tab {
  key: 'Surah' | 'Juz' | 'Page';
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab: 'Surah' | 'Juz' | 'Page';
  setActiveTab: (tab: 'Surah' | 'Juz' | 'Page') => void;
  prepareForTabSwitch: (tab: 'Surah' | 'Juz' | 'Page') => void;
}

const SidebarTabs = ({ tabs, activeTab, setActiveTab, prepareForTabSwitch }: Props) => (
  <div className="flex items-center p-1 rounded-full bg-interactive border border-border">
    {tabs.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => {
          prepareForTabSwitch(key);
          setActiveTab(key);
        }}
        className={`w-1/3 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeTab === key ? 'bg-surface text-foreground shadow' : 'text-muted hover:text-foreground hover:bg-surface/30'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default SidebarTabs;
