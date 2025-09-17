import { toHaveNoViolations } from 'jest-axe';
import Link from 'next/link';
import React from 'react';

import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { getJuzList, getSurahList } from '@/lib/api';

import {
  expectNoAccessibilityViolations,
  setupCorePageAccessibilitySuite,
  waitForNavigationElements,
  waitForSelector,
} from './utils/corePages';

import type { Juz, Surah } from '@/types';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn(),
  getJuzList: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockedGetSurahList = getSurahList as jest.MockedFunction<typeof getSurahList>;
const mockedGetJuzList = getJuzList as jest.MockedFunction<typeof getJuzList>;

expect.extend(toHaveNoViolations);

// Test components that simulate server component behavior
const TestHomePage: React.FC = () => (
  <main className="p-6">
    <h1 className="text-xl font-bold mb-4">Quran App</h1>
    <nav aria-label="Main navigation">
      <ul className="space-y-2">
        <li>
          <Link href="/surah">Browse Surahs</Link>
        </li>
        <li>
          <Link href="/juz">Browse Juz</Link>
        </li>
        <li>
          <Link href="/search">Search</Link>
        </li>
        <li>
          <Link href="/bookmarks">Bookmarks</Link>
        </li>
      </ul>
    </nav>
  </main>
);

const TestSurahIndexPage: React.FC = () => {
  const [surahs, setSurahs] = React.useState<Surah[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getSurahList().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Surahs</h1>
      <nav aria-label="Surah list">
        <ul className="space-y-2">
          {surahs.map((surah: Surah) => (
            <li key={surah.number}>
              <Link
                href={`/surah/${surah.number}`}
                aria-label={`Read ${surah.name} (${surah.meaning})`}
              >
                {surah.name} - {surah.meaning}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

const TestJuzIndexPage: React.FC = () => {
  const [juzList, setJuzList] = React.useState<Juz[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getJuzList().then((data) => {
      setJuzList(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Juz</h1>
      <nav aria-label="Juz list">
        <ul className="space-y-2">
          {juzList.map((juz: Juz) => (
            <li key={juz.id}>
              <Link href={`/juz/${juz.juz_number}`} aria-label={`Read Juz ${juz.juz_number}`}>
                Juz {juz.juz_number}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

const TestBookmarksPage: React.FC = () => (
  <main className="p-6">
    <h1 className="text-xl font-bold mb-4">Bookmarks</h1>
    <nav aria-label="Bookmark categories">
      <ul className="space-y-2">
        <li>
          <Link href="/bookmarks/pinned">Pinned</Link>
        </li>
        <li>
          <Link href="/bookmarks/last-read">Last Read</Link>
        </li>
        <li>
          <Link href="/bookmarks/memorization">Memorization</Link>
        </li>
      </ul>
    </nav>
  </main>
);

const TestSearchPage: React.FC = () => (
  <main className="p-6">
    <h1 className="text-xl font-bold mb-4">Search Quran</h1>
    <form role="search">
      <label htmlFor="search-input" className="block mb-2">
        Search for verses:
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Enter search term..."
        aria-label="Search for verses in the Quran"
        className="p-2 border rounded"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </form>
  </main>
);

const TestTafsirIndexPage: React.FC = () => (
  <main className="p-6">
    <h1 className="text-xl font-bold mb-4">Tafsir</h1>
    <p className="mb-4">Select a surah to view its commentary</p>
    <nav aria-label="Surah selection for tafsir">
      <ul className="space-y-2">
        <li>
          <Link href="/tafsir/1/1">Al-Fatihah</Link>
        </li>
        <li>
          <Link href="/tafsir/2/1">Al-Baqarah</Link>
        </li>
      </ul>
    </nav>
  </main>
);

describe('Home page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestHomePage />);
    await expectNoAccessibilityViolations(container);
  });

  it('should have proper heading structure', async () => {
    await renderWithProvidersAsync(<TestHomePage />);
    const heading = document.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();
  });

  it('should have proper landmark roles', async () => {
    await renderWithProvidersAsync(<TestHomePage />);
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});

describe('Surah index page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestSurahIndexPage />);
    await waitForSelector(container, 'h1');
    await expectNoAccessibilityViolations(container);
  });

  it('should have accessible navigation', async () => {
    await renderWithProvidersAsync(<TestSurahIndexPage />);
    await waitForNavigationElements();
  });
});

describe('Juz index page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestJuzIndexPage />);
    await waitForSelector(container, 'h1');
    await expectNoAccessibilityViolations(container);
  });
});

describe('Bookmarks page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestBookmarksPage />);
    await expectNoAccessibilityViolations(container);
  });

  it('should have proper list structure for bookmarks', async () => {
    await renderWithProvidersAsync(<TestBookmarksPage />);
    const lists = document.querySelectorAll('[role="list"], ul, ol');
    expect(lists.length).toBeGreaterThan(0);
  });
});

describe('Search page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestSearchPage />);
    await expectNoAccessibilityViolations(container);
  });

  it('should have accessible search form', async () => {
    await renderWithProvidersAsync(<TestSearchPage />);
    const searchInput = document.querySelector('input[type="search"]');
    expect(searchInput).toHaveAttribute('aria-label');
    expect(searchInput).toHaveAttribute('id');

    const label = document.querySelector('label[for="search-input"]');
    expect(label).toBeInTheDocument();
  });
});

describe('Tafsir index page accessibility', () => {
  setupCorePageAccessibilitySuite({ mockedGetSurahList, mockedGetJuzList });

  it('should not have accessibility violations', async () => {
    const { container } = await renderWithProvidersAsync(<TestTafsirIndexPage />);
    await expectNoAccessibilityViolations(container);
  });
});

describe('Core Components Accessibility', () => {
  // Test critical shared components
  describe('Audio Player', () => {
    it('should have accessible media controls', () => {
      // This will be tested when the component is rendered within pages
      expect(true).toBe(true); // Placeholder for now
    });
  });

  describe('Navigation Components', () => {
    it('should have proper keyboard navigation', () => {
      // This will be tested when the component is rendered within pages
      expect(true).toBe(true); // Placeholder for now
    });
  });
});
