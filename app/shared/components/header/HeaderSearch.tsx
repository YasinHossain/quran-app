'use client';

import { useRouter } from 'next/navigation';
import {
  memo,
  type KeyboardEvent,
  type ReactElement,
  type FocusEvent,
  useCallback,
  useState,
} from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';
import { GoToSurahVerseForm } from '@/app/shared/components/go-to/GoToSurahVerseForm';
import { buildSurahRoute } from '@/app/shared/navigation/routes';

export const HeaderSearch = memo(function HeaderSearch(): ReactElement {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

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

  const showPopover = focused;

  const handleNavigate = useCallback(
    (surahId: number, verseNumber?: number): void => {
      const href =
        typeof verseNumber === 'number'
          ? buildSurahRoute(surahId, { startVerse: verseNumber, forceSeq: true })
          : buildSurahRoute(surahId);
      // Prevent default scroll-to-top and force a unique nav sequence so
      // the reader view reliably re-centers on the requested ayah even when cached.
      router.push(href, { scroll: false });
      setFocused(false);
    },
    [router]
  );

  return (
    <div className="flex items-center justify-center w-1/3">
      <div
        className="w-full max-w-xs sm:max-w-sm lg:max-w-md relative"
        onFocus={(): void => setFocused(true)}
        onBlur={(e: FocusEvent<HTMLDivElement>): void => {
          const next = e.relatedTarget as Node | null;
          if (!e.currentTarget.contains(next)) setFocused(false);
        }}
      >
        <SearchInput
          value={query}
          onChange={handleChange}
          placeholder="Search verses, surahs..."
          onKeyDown={handleKeyDown}
          variant="header"
          size="sm"
          className="w-full"
        />

        {/* Dropdown form */}
        {showPopover && (
          <div className="absolute mt-2 z-dropdown left-1/2 -translate-x-1/2 w-[86vw] sm:w-[22rem] md:w-[26rem] lg:w-[28rem]">
            <div
              className="rounded-xl border border-border bg-surface shadow-card overflow-visible"
              onMouseDown={(event): void => {
                // Clicking the backdrop area should not close the popover
                if (event.target === event.currentTarget) {
                  event.preventDefault();
                }
              }}
            >
              <GoToSurahVerseForm onNavigate={handleNavigate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
