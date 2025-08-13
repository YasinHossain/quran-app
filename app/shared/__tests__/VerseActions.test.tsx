import { render, screen } from '@testing-library/react';
import VerseActions from '../VerseActions';

const noop = () => {};

test('renders tafsir link', () => {
  render(
    <VerseActions
      verseKey="1:1"
      isPlaying={false}
      isLoadingAudio={false}
      isBookmarked={false}
      onPlayPause={noop}
      onBookmark={noop}
    />
  );
  const link = screen.getByRole('link', { name: 'View tafsir' });
  expect(link).toHaveAttribute('href', '/tafsir/1/1');
});
