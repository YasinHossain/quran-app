'use client';

import { useRouter } from 'next/navigation';
import { memo, type KeyboardEvent, type ReactElement, useCallback, useState } from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';

export const HeaderSearch = memo(function HeaderSearch(): ReactElement {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleChange = useCallback((value: string): void => {
    setQuery(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && query.trim()) {
        router.push(`/search?query=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <div className="flex items-center justify-center w-1/3">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <SearchInput
          value={query}
          onChange={handleChange}
          placeholder="Search verses, surahs..."
          onKeyDown={handleKeyDown}
          variant="header"
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
});
