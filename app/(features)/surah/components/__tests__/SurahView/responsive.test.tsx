import { screen } from '@testing-library/react';

import { renderSurahView } from './test-utils';

describe('SurahView responsive', () => {
  it('applies mobile-first responsive layout', () => {
    renderSurahView();

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('data-slot', 'surah-workspace-main');
    // With both desktop sidebars rendered, WorkspaceMain should not reserve extra gutter space.
    expect(main.className).not.toContain('lg:pl-reader-sidebar-left');
    expect(main.className).not.toContain('lg:pr-reader-sidebar-right');
    expect(main.className).toContain('pb-safe');

    const scrollContainer = document.querySelector('main > div.flex') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer!).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });
});
