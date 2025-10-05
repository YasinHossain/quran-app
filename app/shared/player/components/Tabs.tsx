import React, { memo } from 'react';

import { MicIcon, RepeatIcon } from '@/app/shared/icons';

interface Props {
  activeTab: 'reciter' | 'repeat';
  setActiveTab: (tab: 'reciter' | 'repeat') => void;
}

export const Tabs = memo(function Tabs({ activeTab, setActiveTab }: Props): React.JSX.Element {
  return (
    <div className="mb-4 flex justify-center gap-2">
      <button
        onClick={() => setActiveTab('reciter')}
        className={`px-3 py-1.5 rounded-full text-sm ${
          activeTab === 'reciter'
            ? 'bg-accent/10 text-accent'
            : 'bg-surface hover:bg-interactive-hover'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <MicIcon className="h-4 w-4" />
          Reciter
        </span>
      </button>
      <button
        onClick={() => setActiveTab('repeat')}
        className={`px-3 py-1.5 rounded-full text-sm ${
          activeTab === 'repeat'
            ? 'bg-accent/10 text-accent'
            : 'bg-surface hover:bg-interactive-hover'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <RepeatIcon className="h-4 w-4" />
          Verse Repeat
        </span>
      </button>
    </div>
  );
});
