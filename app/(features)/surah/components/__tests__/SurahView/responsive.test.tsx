import { screen } from '@testing-library/react';
import { renderSurahView } from './test-utils';

describe('SurahView responsive', () => {
  it('applies mobile-first responsive layout', () => {
    renderSurahView();

    const main = screen.getByRole('main');
    expect(main).toHaveClass('h-screen', 'overflow-hidden', 'lg:mr-[20.7rem]');

    const scrollContainer = document.querySelector('main .overflow-y-auto') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer!).toHaveClass('px-4', 'sm:px-6', 'lg:px-8', 'pb-6');
    expect(scrollContainer!.className).toContain('pt-[calc(3.5rem+env(safe-area-inset-top))]');
  });
});
