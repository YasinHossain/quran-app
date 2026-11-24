import { renderSurahView } from './test-utils';

describe('SurahView context', () => {
  it('renders verse content within providers', () => {
    renderSurahView();
    const verseEl = document.querySelector('#verse-1');
    expect(verseEl).toBeInTheDocument();
  });
});
