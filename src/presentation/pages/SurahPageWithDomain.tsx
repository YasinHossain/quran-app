'use client';

import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/src/application/providers/BookmarkProvider';
import { SurahReadingLayout } from '../components/organisms/layouts/SurahReadingLayout';

interface SurahPageWithDomainProps {
  surahId: number;
}

/**
 * Example of how a page component would use the new domain-driven architecture.
 * This shows separation between:
 * - Domain logic (handled by services and entities)
 * - Application logic (handled by providers and application hooks)
 * - Presentation logic (handled by presentation components and UI hooks)
 */
export const SurahPageWithDomain = ({ surahId }: SurahPageWithDomainProps) => {
  // UI state from existing providers
  const { settings } = useSettings();

  // Domain state from new domain-aware providers
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

  return (
    <SurahReadingLayout
      surahId={surahId}
      enabledTranslations={(settings as any).enabledTranslations || []}
      enabledTafsirs={(settings as any).enabledTafsirs || []}
      enableTajweed={settings.tajweed ?? false}
      arabicFontSize={settings.arabicFontSize ?? 24}
      translationFontSize={settings.translationFontSize ?? 16}
      fontFamily={settings.arabicFontFace || 'Noto Sans Arabic'}
    >
      {/* Header, navigation, or other layout elements can go here */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Surah {surahId}</h1>
        <p className="text-muted">
          {bookmarksLoading ? 'Loading bookmarks...' : `${bookmarks.length} bookmarks`}
        </p>
      </header>
    </SurahReadingLayout>
  );
};
