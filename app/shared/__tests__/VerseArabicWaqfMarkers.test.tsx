import { render } from '@testing-library/react';
import React from 'react';

import { SettingsProvider } from '@/app/providers/SettingsContext';
import { VerseArabic } from '@/app/shared/VerseArabic';

import type { Verse } from '@/types';

const renderWithSettings = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(<SettingsProvider>{ui}</SettingsProvider>);

describe('VerseArabic waqf marker rendering', () => {
  it('keeps standalone waqf markers attached to the preceding word', () => {
    const verse: Verse = {
      id: 1,
      verse_key: '2:2',
      text_uthmani: '',
      words: [
        { id: 1, uthmani: 'ذَٰلِكَ', position: 1 },
        { id: 2, uthmani: 'ٱلْكِتَابُ', position: 2 },
        { id: 3, uthmani: 'لَا', position: 3 },
        { id: 4, uthmani: 'رَيْبَ', position: 4 },
        // U+06DB (ۛ) can be returned as a standalone "word" by some APIs.
        { id: 5, uthmani: 'ۛ', position: 5 },
        { id: 6, uthmani: 'فِيهِ', position: 6 },
        { id: 7, uthmani: 'ۛ', position: 7 },
        { id: 8, uthmani: 'هُدًى', position: 8 },
      ],
      translations: [],
    } as Verse;

    const { container } = renderWithSettings(<VerseArabic verse={verse} />);
    const arabicParagraph = container.querySelector<HTMLParagraphElement>('p[dir="rtl"]');
    expect(arabicParagraph).toBeTruthy();

    const textContent = arabicParagraph?.textContent ?? '';
    expect(textContent).toContain('رَيْبَۛ فِيهِۛ هُدًى');
    expect(textContent).not.toContain('رَيْبَ ۛ');
    expect(textContent).not.toContain('فِيهِ ۛ');
  });
});
