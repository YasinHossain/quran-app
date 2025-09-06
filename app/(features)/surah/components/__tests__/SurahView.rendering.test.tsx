import { screen } from '@testing-library/react';
import React from 'react';

import { renderSurahView } from './SurahView/test-helpers';

describe('SurahView rendering', () => {
  it('applies mobile-first responsive layout', () => {
    renderSurahView();

    const main = screen.getByRole('main');
    expect(main).toHaveClass('h-screen', 'overflow-hidden', 'lg:mr-[20.7rem]');

    const scrollContainer = document.querySelector('main .overflow-y-auto') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer!).toHaveClass('px-4', 'sm:px-6', 'lg:px-8', 'pb-6');
    expect(scrollContainer!.className).toContain('pt-[calc(3.5rem+env(safe-area-inset-top))]');
  });

  it('renders verse content within providers', () => {
    renderSurahView();
    const verseEl = document.querySelector('#verse-1');
    expect(verseEl).toBeInTheDocument();
  });
});
