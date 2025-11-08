'use client';

import React from 'react';

import { BookmarkIcon } from '@/app/shared/icons';

import { SearchIcon, SearchContent, SearchActions } from './empty-states';

interface EmptySearchProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const EmptyBookmarks = (): React.JSX.Element => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <BookmarkIcon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Create Your First Folder</h3>
      <p className="text-muted max-w-md mx-auto">
        Tap the <span className="font-semibold text-foreground">+</span> button in the top-right
        corner to add a folder and start organizing your favorite verses.
      </p>
    </div>
  );
};

export const EmptySearch = ({ searchTerm, onClearSearch }: EmptySearchProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`mx-auto max-w-lg py-20 text-center transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <SearchIcon />
      <SearchContent searchTerm={searchTerm} />
      <SearchActions onClearSearch={onClearSearch} />
    </div>
  );
};
