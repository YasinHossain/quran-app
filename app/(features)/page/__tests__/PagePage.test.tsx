import { act } from '@testing-library/react';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import QuranPage from '@/app/(features)/page/[pageId]/page';
import { Verse } from '@/types';
import * as api from '@/lib/api';
import { identity } from '@/tests/mocks';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: identity };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'page verse',
  words: [],
} as Verse;

jest.mock('@/lib/api');

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByPage as jest.Mock).mockResolvedValue({
    verses: [mockVerse],
    totalPages: 1,
  });
});

const renderPage = () =>
  renderWithProviders(
    <QuranPage params={{ pageId: '1' } as unknown as Promise<{ pageId: string }>} />
  );

test('renders page without crashing', async () => {
  await act(async () => {
    renderPage();
  });
  expect(api.getVersesByPage).toBeDefined();
});
