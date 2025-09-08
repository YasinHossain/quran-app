'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SearchInput } from '../SearchInput';

export function HeaderSearch(): JSX.Element {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-1/3">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search verses, surahs..."
          onKeyDown={handleKeyDown}
          variant="header"
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
}
