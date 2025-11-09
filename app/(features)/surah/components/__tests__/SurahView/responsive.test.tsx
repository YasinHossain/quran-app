import { screen } from '@testing-library/react';

import { renderSurahView } from './test-utils';

describe('SurahView responsive', () => {
  it('applies mobile-first responsive layout', () => {
    renderSurahView();

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('data-slot', 'surah-workspace-main');
    expect(main.className).toContain('lg:pl-reader-sidebar-left');
    expect(main.className).toContain('lg:pr-reader-sidebar-right');
    expect(main.className).toContain('pb-safe');

    const scrollContainer = document.querySelector('main > div.flex') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer!).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });
});
