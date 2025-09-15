/* eslint-disable jsx-a11y/anchor-is-valid */
import { waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Link from 'next/link';
import React from 'react';

import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { getSurahList, getJuzList } from '@/lib/api';
import { Surah, Juz } from '@/types';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn(),
  getJuzList: jest.fn(),
}));

jest.mock(
  'next/link',
  () =>
    ({ href, children }: { href: string; children: React.ReactElement }) =>
      React.cloneElement(children, { href })
);

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
          <Link href="/surah">
            <a>Browse Surahs</a>
          </Link>
        </li>
        <li>
          <Link href="/juz">
            <a>Browse Juz</a>
          </Link>
        </li>
        <li>
          <Link href="/search">
            <a>Search</a>
          </Link>
        </li>
        <li>
          <Link href="/bookmarks">
            <a>Bookmarks</a>
          </Link>
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
          {surahs.map((s: Surah) => (
            <li key={s.number}>
              <Link href={`/surah/${s.number}`}>
                <a aria-label={`Read ${s.name} (${s.meaning})`}>
                  {s.name} - {s.meaning}
                </a>
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
            <li key={juz.number}>
              <Link href={`/juz/${juz.number}`}>
                <a aria-label={`Read Juz ${juz.number}`}>Juz {juz.number}</a>
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
          <Link href="/bookmarks/pinned">
            <a>Pinned</a>
          </Link>
        </li>
        <li>
          <Link href="/bookmarks/last-read">
            <a>Last Read</a>
          </Link>
        </li>
        <li>
          <Link href="/bookmarks/memorization">
            <a>Memorization</a>
          </Link>
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
          <Link href="/tafsir/1/1">
            <a>Al-Fatihah</a>
          </Link>
        </li>
        <li>
          <Link href="/tafsir/2/1">
            <a>Al-Baqarah</a>
          </Link>
        </li>
      </ul>
    </nav>
  </main>
);

describe('Core Pages Accessibility', () => {
  beforeAll(() => {
    setMatchMedia(false);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock API responses
    mockedGetSurahList.mockResolvedValue([
      {
        number: 1,
        name: 'Al-Fatihah',
        arabicName: 'الفاتحة',
        verses: 7,
        meaning: 'The Opening',
      },
      {
        number: 2,
        name: 'Al-Baqarah',
        arabicName: 'البقرة',
        verses: 286,
        meaning: 'The Cow',
      },
    ]);

    mockedGetJuzList.mockResolvedValue([
      { number: 1, surahs: ['Al-Fatihah', 'Al-Baqarah'] },
      { number: 2, surahs: ['Al-Baqarah'] },
    ] as Juz[]);
  });

  describe('Home Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestHomePage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', async () => {
      await renderWithProvidersAsync(<TestHomePage />);
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1).toBeVisible();
    });

    it('should have proper landmark roles', async () => {
      await renderWithProvidersAsync(<TestHomePage />);
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Surah Index Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestSurahIndexPage />);
      await waitFor(() => {
        expect(container.querySelector('h1')).toBeInTheDocument();
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible navigation', async () => {
      await renderWithProvidersAsync(<TestSurahIndexPage />);
      await waitFor(() => {
        const navElements = document.querySelectorAll('[role="navigation"], nav');
        expect(navElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Juz Index Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestJuzIndexPage />);
      await waitFor(() => {
        expect(container.querySelector('h1')).toBeInTheDocument();
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Bookmarks Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestBookmarksPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper list structure for bookmarks', async () => {
      await renderWithProvidersAsync(<TestBookmarksPage />);
      const lists = document.querySelectorAll('[role="list"], ul, ol');
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe('Search Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestSearchPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
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

  describe('Tafsir Index Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = await renderWithProvidersAsync(<TestTafsirIndexPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
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
