import userEvent from '@testing-library/user-event';

import { VerseCard } from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/VerseCard';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ اللَّهِ',
  words: [
    { id: 1, uthmani: 'بِسْمِ', en: 'In' },
    { id: 2, uthmani: 'اللَّهِ', en: 'Allah' },
  ],
  translations: [{ resource_id: 20, text: 'In the name of Allah' }],
};

const renderCard = () => renderWithProviders(<VerseCard verse={verse} />);

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

it('renders verse key and translation', () => {
  renderCard();
  expect(screen.getByText('1:1')).toBeInTheDocument();
  expect(screen.getByText('In the name of Allah')).toBeInTheDocument();
});

it('toggles play/pause on click', async () => {
  renderCard();
  const playButton = screen.getByRole('button', { name: 'Play audio' });
  await userEvent.click(playButton);
  expect(playButton).toHaveAttribute('aria-label', 'Pause audio');
  await userEvent.click(playButton);
  expect(playButton).toHaveAttribute('aria-label', 'Play audio');
});

it('bookmarks verse when icon clicked', async () => {
  renderCard();
  const bookmarkButton = screen.getByRole('button', { name: 'Add bookmark' });
  await userEvent.click(bookmarkButton);
  expect(bookmarkButton).toHaveAttribute('aria-label', 'Remove bookmark');
});

it('strips malicious tags from content', () => {
  const maliciousVerse: Verse = {
    id: 2,
    verse_key: '1:2',
    text_uthmani: 'م<script>alert(1)</script>',
    words: [{ id: 1, uthmani: 'م<script>alert(1)</script>', en: 'In' }],
    translations: [{ resource_id: 20, text: '<script>alert(1)</script>Safe' }],
  };

  renderWithProviders(<VerseCard verse={maliciousVerse} />);

  expect(document.querySelector('script')).toBeNull();
  expect(screen.getByText('Safe')).toBeInTheDocument();
});
