import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { SettingsProvider } from '@/app/providers/SettingsContext';
import { VerseArabic } from '@/app/shared/VerseArabic';

import type { Verse } from '@/types';

const createVerse = (overrides: Partial<Verse> = {}): Verse =>
  ({
    id: 1,
    verse_key: '1:1',
    text_uthmani: 'السلام عليكم',
    words: [],
    translations: [],
    ...overrides,
  }) as Verse;

const renderWithSettings = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(<SettingsProvider>{ui}</SettingsProvider>);

const getArabicParagraph = (container: HTMLElement): HTMLParagraphElement => {
  const arabicParagraph = container.querySelector<HTMLParagraphElement>('p[dir="rtl"]');
  if (!arabicParagraph) {
    throw new Error('Arabic paragraph not found');
  }
  return arabicParagraph;
};

const getFirstTextNode = (element: Element): ChildNode => {
  const textNode = element.querySelector('span')?.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    throw new Error('Text node not found');
  }
  return textNode;
};

const setSelection = (range: Range): void => {
  const selection = window.getSelection();
  if (!selection) {
    throw new Error('Selection API not available');
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

describe('VerseArabic copy behavior', () => {
  it('overrides clipboard when selection stays within Arabic text', () => {
    const verse = createVerse();
    const { container } = renderWithSettings(<VerseArabic verse={verse} />);

    const arabicParagraph = getArabicParagraph(container);
    const arabicTextNode = getFirstTextNode(arabicParagraph);
    const range = document.createRange();
    range.setStart(arabicTextNode, 0);
    range.setEnd(arabicTextNode, arabicTextNode.textContent?.length ?? 0);
    setSelection(range);

    const clipboardData = { setData: jest.fn() };
    const event = createEvent.copy(arabicParagraph, { clipboardData });
    fireEvent(arabicParagraph, event);

    expect(event.defaultPrevented).toBe(true);
    expect(clipboardData.setData).toHaveBeenCalledWith('text/plain', 'السلام عليكم');
  });

  it('does not override clipboard when selection extends into non-Arabic content', () => {
    const verse = createVerse();
    const { container } = renderWithSettings(
      <div>
        <VerseArabic verse={verse} />
        <p data-testid="translation">Peace be upon you</p>
      </div>
    );

    const arabicParagraph = getArabicParagraph(container);
    const translationParagraph = screen.getByTestId('translation');
    const translationTextNode = translationParagraph.firstChild;
    if (!translationTextNode || translationTextNode.nodeType !== Node.TEXT_NODE) {
      throw new Error('Translation text node not found');
    }

    const arabicTextNode = getFirstTextNode(arabicParagraph);
    const range = document.createRange();
    range.setStart(arabicTextNode, 0);
    range.setEnd(translationTextNode, translationTextNode.textContent?.length ?? 0);
    setSelection(range);

    const clipboardData = { setData: jest.fn() };
    const event = createEvent.copy(arabicParagraph, { clipboardData });
    fireEvent(arabicParagraph, event);

    expect(event.defaultPrevented).toBe(false);
    expect(clipboardData.setData).not.toHaveBeenCalled();
  });
});
