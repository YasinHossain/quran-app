import { renderSurahView } from './test-utils';

describe('SurahView accessibility', () => {
  it('provides screen reader support', () => {
    renderSurahView();
    const verseEl = document.querySelector('#verse-1');
    expect(verseEl).toHaveAttribute('aria-label');
  });
});
