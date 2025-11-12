import { ReaderVerseCard } from '@/app/shared/reader';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { Verse } from '@/types';

const baseVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  translations: [
    {
      resource_id: 20,
      text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful',
    },
  ],
  words: [
    { id: 1, uthmani: 'بِسْمِ', text_madani: 'بِسْمِ', text_imlaei_simple: 'بسم' },
    { id: 2, uthmani: 'اللَّهِ', text_madani: 'اللَّهِ', text_imlaei_simple: 'الله' },
  ],
};

describe('ReaderVerseCard', () => {
  it('renders verse content and translations', () => {
    renderWithProviders(<ReaderVerseCard verse={baseVerse} />);

    expect(screen.getByText('بِسْمِ')).toBeInTheDocument();
    expect(screen.getByText('اللَّهِ')).toBeInTheDocument();
    expect(
      screen.getByText('In the name of Allah, the Entirely Merciful, the Especially Merciful')
    ).toBeInTheDocument();
  });

  it('supports slot customization through children and footer', () => {
    renderWithProviders(
      <ReaderVerseCard verse={baseVerse} footer={<div data-testid="footer-slot" />} />
    );

    expect(screen.getByTestId('footer-slot')).toBeInTheDocument();
  });

  it('applies variant styling when contained', () => {
    const { container } = renderWithProviders(
      <ReaderVerseCard verse={baseVerse} variant="contained" className="rounded-md shadow" />
    );

    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('rounded-md');
    expect(card).toHaveClass('shadow');
  });

  it('honors custom translation font sizing when provided', () => {
    renderWithProviders(<ReaderVerseCard verse={baseVerse} translationFontSize={22} />);

    const translation = screen.getByText(
      'In the name of Allah, the Entirely Merciful, the Especially Merciful'
    );
    expect(translation).toHaveStyle({ fontSize: '22px' });
  });

  it('sanitizes translation content', () => {
    const maliciousVerse: Verse = {
      ...baseVerse,
      id: 2,
      verse_key: '1:2',
      translations: [
        {
          resource_id: 21,
          text: '<script>alert("bad")</script>Safe content',
        },
      ],
    };

    renderWithProviders(<ReaderVerseCard verse={maliciousVerse} />);

    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });
});
