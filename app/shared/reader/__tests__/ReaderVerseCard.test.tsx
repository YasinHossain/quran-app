import { defaultSettings } from '@/app/providers/settingsStorage';
import { ReaderVerseCard } from '@/app/shared/reader';
import { renderWithProviders, screen, waitFor } from '@/app/testUtils/renderWithProviders';

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

afterEach(() => {
  localStorage.clear();
});

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
          resource_id: 20,
          text: '<script>alert("bad")</script>Safe content',
        },
      ],
    };

    renderWithProviders(<ReaderVerseCard verse={maliciousVerse} />);

    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('strips unsupported silent alif marks when QPC Hafs font is selected', async () => {
    const verseWithSilentAlif: Verse = {
      id: 3,
      verse_key: '1:3',
      text_uthmani: 'و\u06DF',
      words: [{ id: 3, uthmani: 'و\u06DF' }],
    };

    localStorage.setItem(
      'quranAppSettings',
      JSON.stringify({ ...defaultSettings, arabicFontFace: '"UthmanicHafs1Ver18", serif' })
    );

    const { container } = renderWithProviders(<ReaderVerseCard verse={verseWithSilentAlif} />);

    await waitFor(() => {
      expect(container.textContent).not.toContain('\u06DF');
    });
    expect(screen.getByText('و')).toBeInTheDocument();
  });
});
