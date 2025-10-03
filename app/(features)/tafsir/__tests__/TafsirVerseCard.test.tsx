import userEvent from '@testing-library/user-event';

import { VerseCard } from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/VerseCard';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen, waitFor } from '@/app/testUtils/renderWithProviders';
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

const renderCard = (): void => {
  renderWithProviders(<VerseCard verse={verse} />);
};

beforeAll(() => {
  setMatchMedia(true);
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
  await waitFor(() => expect(playButton).toHaveAttribute('aria-label', 'Pause audio'));
  await userEvent.click(playButton);
  await waitFor(() => expect(playButton).toHaveAttribute('aria-label', 'Play audio'));
});

it('opens bookmark modal when icon clicked', async () => {
  renderCard();
  const bookmarkButton = screen.getByRole('button', { name: 'Add bookmark' });
  await userEvent.click(bookmarkButton);
  expect(await screen.findByRole('dialog', { name: 'Bookmark options' })).toBeInTheDocument();
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
