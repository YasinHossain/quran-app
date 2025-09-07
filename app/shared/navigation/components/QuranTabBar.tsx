import { motion } from 'framer-motion';
import { memo } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

interface QuranTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: 'surah' | 'juz' | 'page') => void;
}

export const QuranTabBar = memo(function QuranTabBar({
  tabs,
  activeTab,
  onTabChange,
}: QuranTabBarProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'surah' | 'juz' | 'page')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all duration-200 relative ${
              isActive ? 'text-accent' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icon size={18} className="stroke-[2]" />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});
