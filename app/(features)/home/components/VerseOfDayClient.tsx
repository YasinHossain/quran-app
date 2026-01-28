'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/app/providers/SettingsContext';

import { VerseOfDay } from './VerseOfDay';

import type { Chapter, Verse } from '@/types';

const VERSES_OF_DAY_COUNT = 5;
const FETCH_DELAY_MS = 900;

const VOTD_CACHE = new Map<string, Verse[]>();

const scheduleIdleWork = (work: () => void): (() => void) => {
  const win = window as unknown as {
    requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  let delayTimer: number | null = null;
  let idleHandle: number | null = null;

  const run = () => {
    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(work, { timeout: 1500 });
      return;
    }
    work();
  };

  delayTimer = window.setTimeout(run, FETCH_DELAY_MS);

  return () => {
    if (delayTimer !== null) window.clearTimeout(delayTimer);
    if (idleHandle !== null) win.cancelIdleCallback?.(idleHandle);
  };
};

function VerseOfDaySkeleton({ showTranslation }: { showTranslation: boolean }): React.JSX.Element {
  return (
    <div
      className="w-full p-4 md:p-6 lg:p-8 rounded-2xl shadow-lg bg-surface-navigation border border-border/30 min-h-[180px]"
      role="status"
      aria-label="Loading verse of the day"
      aria-busy="true"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="h-8 md:h-10 w-full rounded bg-interactive animate-pulse" />
          <div className="h-8 md:h-10 w-11/12 rounded bg-interactive animate-pulse" />
        </div>
        {showTranslation && (
          <div className="space-y-2">
            <div className="h-4 w-10/12 rounded bg-interactive animate-pulse" />
            <div className="h-4 w-8/12 rounded bg-interactive animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

export const VerseOfDayClient = memo(function VerseOfDayClient({
  chapters,
}: {
  chapters: ReadonlyArray<Chapter>;
}): React.JSX.Element {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTranslationDisabled = Boolean(settings.translationIds && settings.translationIds.length === 0);
  const activeTranslationId = useMemo(() => {
    if (isTranslationDisabled) return null;
    const primary = settings.translationIds?.[0] ?? settings.translationId ?? null;
    return typeof primary === 'number' && Number.isFinite(primary) ? primary : null;
  }, [isTranslationDisabled, settings.translationId, settings.translationIds]);

  const translationsParam = useMemo(() => {
    if (isTranslationDisabled) return '';
    if (typeof activeTranslationId === 'number') return String(activeTranslationId);
    return '';
  }, [activeTranslationId, isTranslationDisabled]);

  const cacheKey = useMemo(() => `t:${translationsParam || 'none'}`, [translationsParam]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const controller = new AbortController();

    setIsLoading(true);
    setVerses(null);

    const cached = VOTD_CACHE.get(cacheKey);
    if (cached) {
      setVerses(cached);
      setIsLoading(false);
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    const cancelIdle = scheduleIdleWork(() => {
      void (async () => {
        try {
          const url = new URL('/api/verses-of-day', window.location.origin);
          if (translationsParam) {
            url.searchParams.set('translations', translationsParam);
          }
          url.searchParams.set('count', String(VERSES_OF_DAY_COUNT));

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          });
          if (!response.ok) {
            throw new Error(`Failed to load verses of the day: ${response.status}`);
          }

          const data = (await response.json()) as unknown;
          const next = Array.isArray(data) ? (data as Verse[]) : [];

          if (cancelled) return;
          VOTD_CACHE.set(cacheKey, next);
          setVerses(next);
        } catch {
          if (cancelled) return;
          setVerses([]);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      controller.abort();
    };
  }, [cacheKey, translationsParam, i18n.language]);

  if (isLoading || !verses || verses.length === 0) {
    return <VerseOfDaySkeleton showTranslation={!isTranslationDisabled} />;
  }

  return <VerseOfDay verses={verses} chapters={chapters} />;
});

