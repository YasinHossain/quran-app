'use client';

import { buildSurahRoute } from '@/app/shared/navigation/routes';

const STORAGE_KEY = 'quranAppTafsirReturn_v1';

interface TafsirReturnState {
  href: string;
  createdAt: number;
}

const parseVerseKey = (verseKey: string): { surahId: string; ayahId: string } | null => {
  const [surahIdRaw, ayahIdRaw] = String(verseKey).split(':');
  const surahId = surahIdRaw?.trim();
  const ayahId = ayahIdRaw?.trim();
  if (!surahId || !ayahId) return null;
  return { surahId, ayahId };
};

export const setTafsirReturnFromVerseKey = (verseKey: string): void => {
  if (typeof window === 'undefined') return;
  const parsed = parseVerseKey(verseKey);
  if (!parsed) return;

  const href = buildSurahRoute(parsed.surahId, { startVerse: parsed.ayahId, forceSeq: true });
  const payload: TafsirReturnState = { href, createdAt: Date.now() };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // no-op
  }
};

export const setTafsirReturnFromTafsirHref = (href: string): void => {
  if (typeof window === 'undefined') return;

  const match = String(href).match(/^\/tafsir\/([^/]+)\/([^/?#]+)/);
  const surahId = match?.[1];
  const ayahId = match?.[2];
  if (!surahId || !ayahId) return;

  const returnHref = buildSurahRoute(surahId, { startVerse: ayahId, forceSeq: true });
  const payload: TafsirReturnState = { href: returnHref, createdAt: Date.now() };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // no-op
  }
};

export const getTafsirReturnHref = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TafsirReturnState> | null;
    const href = typeof parsed?.href === 'string' ? parsed.href : null;
    if (!href || !href.startsWith('/')) return null;
    return href;
  } catch {
    return null;
  }
};

