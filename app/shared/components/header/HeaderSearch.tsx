'use client';

import { useRouter } from 'next/navigation';
import {
  memo,
  type KeyboardEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { GoToSurahVerseForm } from '@/app/shared/components/go-to/GoToSurahVerseForm';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { buildSurahRoute } from '@/app/shared/navigation/routes';

export const HeaderSearch = memo(function HeaderSearch(): ReactElement {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!focused) return;
    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      if (target.closest('[data-surah-select-portal]')) return;
      setFocused(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [focused]);

  return (
    <div className="flex items-center justify-center flex-1 sm:flex-none sm:w-1/3">
      <div
        className="w-full max-w-[55vw] sm:max-w-sm lg:max-w-md relative"
        role="presentation"
        tabIndex={-1}
        onFocus={(): void => setFocused(true)}
        ref={containerRef}
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
          <div className="absolute mt-2 z-[60] left-1/2 -translate-x-1/2 w-[92vw] sm:w-[22rem] md:w-[26rem] lg:w-[28rem]">
            <div
              className="rounded-lg bg-surface shadow-xl overflow-visible"
              role="presentation"
              tabIndex={-1}
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
