import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { AyahNavigation } from '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/AyahNavigation';
import TafsirVersePage from '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/page';

import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { UIStateProvider } from '@/app/providers/UIStateContext';
import { push as routerPush } from '@/app/testUtils/mockRouter';
import { container } from '@/src/infrastructure/di/Container';

import type RealTafsirVersePageClient from '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/TafsirVersePageClient';
import type { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import type { Surah, Verse } from '@/types';

const CHAPTERS = [
  { id: 1, verses_count: 7 },
  { id: 2, verses_count: 286 },
  { id: 114, verses_count: 6 },
];

jest.mock('@/lib/api/server', () => ({
  getChaptersServer: async () => CHAPTERS,
  toVerseCounts: (chapters: typeof CHAPTERS) => {
    // Real surah lengths are needed only up to the ids used here.
    const counts = Array.from({ length: 114 }, () => 1);
    chapters.forEach((c) => (counts[c.id - 1] = c.verses_count));
    return counts;
  },
  getTafsirVersePageDataServer: async () => ({
    verse: { verse_key: '1:7' },
    tafsirHtml: '<p>Tafsir</p>',
    tafsirResource: undefined,
  }),
}));
// The real client needs app providers; the server page only hands it the neighbours.
jest.mock(
  '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/TafsirVersePageClient',
  () => ({
    __esModule: true,
    default: () => null,
  })
);

// --- Client verse switching: the real client with its data layer, minus unrelated chrome. ---
jest.mock('@/lib/api/verses', () => ({ getVerseById: jest.fn(), getVerseByKey: jest.fn() }));
jest.mock('@/app/[lang]/(features)/surah/components', () => ({
  SettingsSidebar: () => null,
  VerseCard: ({ verse }: { verse: Verse }) => <p data-testid="verse">{verse.text_uthmani}</p>,
}));
jest.mock('@/app/[lang]/(features)/surah/components/surah-view/SurahWorkspaceNavigation', () => ({
  SurahWorkspaceNavigation: () => null,
}));
jest.mock('@/app/shared/SurahListSidebar', () => ({ SurahListSidebar: () => null }));
jest.mock('@/app/shared/reader/settings/SettingsSidebarContent', () => ({
  SettingsSidebarContent: () => null,
}));
jest.mock('@/app/shared/player/context/AudioContext', () => ({
  useAudio: () => ({ activeVerse: null, isPlayerVisible: false, reciter: {} }),
}));
jest.mock('@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/TafsirAudioPlayer', () => ({
  TafsirAudioPlayer: () => null,
}));
jest.mock('@/app/[lang]/(features)/tafsir/hooks/useTafsirOptions', () => ({
  useTafsirOptions: () => ({
    tafsirResource: { id: 169, name: 'Ibn Kathir', lang: 'en' },
    selectedTafsirName: 'Ibn Kathir',
  }),
}));
jest.mock('@/app/[lang]/(features)/tafsir/hooks/useTranslationOptions', () => ({
  useTranslationOptions: () => ({ translationOptions: [], selectedTranslationName: '' }),
}));
jest.mock('@/app/[lang]/(features)/tafsir/hooks/useWordTranslations', () => ({
  useWordTranslations: () => ({
    wordLanguageOptions: [],
    wordLanguageMap: {},
    selectedWordLanguageName: '',
    resetWordSettings: jest.fn(),
  }),
}));
jest.mock('@/app/shared/navigation/hooks/useSurahNavigationData', () => ({
  useSurahNavigationData: () => ({
    surahs: Array.from({ length: 114 }, (_, i) => ({
      number: i + 1,
      name: i === 0 ? 'Al-Fatihah' : i === 1 ? 'Al-Baqarah' : `Surah ${i + 1}`,
      arabicName: '',
      verses: i === 0 ? 7 : i === 1 ? 286 : 10,
      meaning: '',
    })),
    chapters: [],
    isLoading: false,
    error: undefined,
  }),
}));

const currentSurah: Surah = {
  number: 1,
  name: 'Al-Fatiha',
  arabicName: 'الفاتحة',
  verses: 7,
  meaning: 'The Opening',
};

test('next link points to next verse', () => {
  render(
    <AyahNavigation
      prev={{ surahId: '1', ayahId: 7 }}
      next={{ surahId: '1', ayahId: 2 }}
      currentSurah={currentSurah}
      surahId="1"
      ayahId="1"
    />
  );

  const nextLink = screen.getByLabelText('Next');
  expect(nextLink).toHaveAttribute('href', '/tafsir/al-fatihah/2');
});

test('previous link points to previous verse', () => {
  render(
    <AyahNavigation
      prev={{ surahId: '1', ayahId: 7 }}
      next={{ surahId: '1', ayahId: 2 }}
      currentSurah={currentSurah}
      surahId="2"
      ayahId="1"
    />
  );

  const prevLink = screen.getByLabelText('Previous');
  expect(prevLink).toHaveAttribute('href', '/tafsir/al-fatihah/7');
});

describe('server-rendered neighbours', () => {
  const neighbours = async (surahId: string, ayahId: string) => {
    const element = await TafsirVersePage({
      params: Promise.resolve({ lang: 'en', surahId, ayahId }),
    });
    const { initialPrev, initialNext } = element.props;
    render(
      <AyahNavigation
        prev={initialPrev}
        next={initialNext}
        surahId={element.props.surahId}
        ayahId={element.props.ayahId}
      />
    );
    return {
      prev: screen.queryByRole('link', { name: 'Previous' }),
      next: screen.queryByRole('link', { name: 'Next' }),
    };
  };

  test('last verse of a surah links to the first verse of the next, with rel', async () => {
    const { prev, next } = await neighbours('al-fatihah', '7');
    expect(next).toHaveAttribute('href', '/tafsir/al-baqarah/1');
    expect(next).toHaveAttribute('rel', 'next');
    expect(prev).toHaveAttribute('href', '/tafsir/al-fatihah/6');
    expect(prev).toHaveAttribute('rel', 'prev');
  });

  test('first verse of a surah links back to the last verse of the previous', async () => {
    const { prev } = await neighbours('al-baqarah', '1');
    expect(prev).toHaveAttribute('href', '/tafsir/al-fatihah/7');
  });

  test('the last verse of the Quran has no next link', async () => {
    const { prev, next } = await neighbours('an-nas', '6');
    expect(next).toBeNull();
    expect(prev).toHaveAttribute('href', '/tafsir/an-nas/5');
  });
});

describe('client verse switching', () => {
  const { getVerseByKey } = jest.requireMock('@/lib/api/verses') as { getVerseByKey: jest.Mock };
  const TafsirVersePageClient = jest.requireActual(
    '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/TafsirVersePageClient'
  ).default as typeof RealTafsirVersePageClient;

  const makeVerse = (key: string): Verse => ({
    id: 1,
    verse_key: key,
    text_uthmani: `arabic ${key}`,
    translations: [{ resource_id: 20, text: `translation ${key}` }],
  });
  const tafsirByVerse = jest.fn();
  const { usePathname } = jest.requireMock('next/navigation') as { usePathname: jest.Mock };

  // Next re-renders `usePathname` readers after `pushState`/popstate; the test re-renders by hand.
  const renderAt = (path: string, surahId: string, ayahId: string) => {
    window.history.replaceState(null, '', path);
    const swrCache = new Map();
    const ui = (): React.JSX.Element => (
      <SWRConfig
        value={{
          provider: () => swrCache,
          dedupingInterval: 0,
          shouldRetryOnError: false,
          // As in production (`FeatureProviders`): a new key briefly returns the previous data.
          keepPreviousData: true,
        }}
      >
        <UIStateProvider>
          <SettingsProvider>
            <SidebarProvider>
              <TafsirVersePageClient
                surahId={surahId}
                ayahId={ayahId}
                initialVerse={makeVerse(`${surahId}:${ayahId}`)}
                initialTafsirHtml={`<p>tafsir ${surahId}:${ayahId}</p>`}
                initialTafsirResource={{ id: 169, name: 'Ibn Kathir', lang: 'en' }}
              />
            </SidebarProvider>
          </SettingsProvider>
        </UIStateProvider>
      </SWRConfig>
    );
    const view = render(ui());
    return { ...view, sync: () => view.rerender(ui()) };
  };

  const expectVerse = async (key: string) => {
    expect(await screen.findByText(`arabic ${key}`)).toBeInTheDocument();
    expect(await screen.findByText(`tafsir ${key}`)).toBeInTheDocument();
  };

  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    usePathname.mockImplementation(() => window.location.pathname);
    getVerseByKey.mockImplementation(async (key: string) => makeVerse(key));
    tafsirByVerse.mockImplementation(async (key: string) => `<p>tafsir ${key}</p>`);
    container.setTafsirRepository({
      getTafsirByVerse: tafsirByVerse,
    } as unknown as ITafsirRepository);
  });

  afterEach(() => {
    container.reset();
    window.history.replaceState(null, '', '/');
  });

  test('Next switches verse and URL on the client, and Back restores it', async () => {
    const { sync } = renderAt('/tafsir/al-fatihah/6', '1', '6');
    await expectVerse('1:6');

    const next = screen.getByRole('link', { name: 'Next' });
    expect(next).toHaveAttribute('href', '/tafsir/al-fatihah/7');
    fireEvent.click(next);
    sync();

    expect(window.location.pathname).toBe('/tafsir/al-fatihah/7');
    expect(routerPush).not.toHaveBeenCalled();
    await expectVerse('1:7');
    expect(screen.queryByText('arabic 1:6')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
      'href',
      '/tafsir/al-baqarah/1'
    );

    await act(async () => {
      const popped = new Promise((resolve) =>
        window.addEventListener('popstate', resolve, { once: true })
      );
      window.history.back();
      await popped;
    });
    sync();
    expect(window.location.pathname).toBe('/tafsir/al-fatihah/6');
    await expectVerse('1:6');
  });

  test('crosses a surah boundary and never shows the previous verse while loading', async () => {
    let resolveVerse: (verse: Verse) => void = () => {};
    const { sync } = renderAt('/tafsir/al-fatihah/7', '1', '7');
    await expectVerse('1:7');
    // Hold the next verse back so the in-between state is visible.
    getVerseByKey.mockImplementation(
      (key: string) =>
        new Promise<Verse>((resolve) => {
          resolveVerse = () => resolve(makeVerse(key));
        })
    );

    fireEvent.click(screen.getByRole('link', { name: 'Next' }));
    sync();

    expect(window.location.pathname).toBe('/tafsir/al-baqarah/1');
    expect(screen.getByTestId('tafsir-verse-loading')).toBeInTheDocument();
    expect(screen.queryByText('arabic 1:7')).not.toBeInTheDocument();
    expect(screen.queryByText('tafsir 1:7')).not.toBeInTheDocument();

    await act(async () => resolveVerse(makeVerse('2:1')));
    await expectVerse('2:1');
    expect(document.title).toContain('Al-Baqarah 2:1 Tafsir');
    expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute(
      'href',
      '/tafsir/al-fatihah/7'
    );
    expect(screen.getByRole('link', { name: '2:1' })).toHaveAttribute(
      'href',
      '/surah/al-baqarah/1'
    );
  });

  test('modified clicks are left to the browser', async () => {
    renderAt('/tafsir/al-fatihah/6', '1', '6');
    await expectVerse('1:6');

    const next = screen.getByRole('link', { name: 'Next' });
    // `fireEvent` returns false when a handler called preventDefault.
    expect(fireEvent.click(next, { ctrlKey: true })).toBe(true);
    expect(fireEvent.click(next, { metaKey: true })).toBe(true);
    expect(fireEvent.click(next, { button: 1 })).toBe(true);
    expect(window.location.pathname).toBe('/tafsir/al-fatihah/6');
    await waitFor(() => expect(screen.getByText('arabic 1:6')).toBeInTheDocument());
  });
});
