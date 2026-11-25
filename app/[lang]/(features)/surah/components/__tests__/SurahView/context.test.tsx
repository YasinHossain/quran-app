import { mockUseVerseListing, renderSurahView } from './test-utils';

describe('SurahView context', () => {
  it('renders verse content within providers', () => {
    renderSurahView();
    const verseEl = document.querySelector('#verse-1');
    expect(verseEl).toBeInTheDocument();
  });
});

describe('SurahView resume after a stale jump link', () => {
  const jumpedAt = 1_700_000_000_000;

  const renderWithHash = (savedUpdatedAt: number): void => {
    localStorage.setItem(
      'quranAppLastRead_v1',
      JSON.stringify({ '9': { verseNumber: 77, verseKey: '9:77', updatedAt: savedUpdatedAt } })
    );
    window.location.hash = `#startVerse=24&nav=${jumpedAt}`;
    renderSurahView('9');
  };

  const requestedVerse = (): unknown =>
    mockUseVerseListing.mock.calls.at(-1)?.[0]?.initialVerseNumber;

  afterEach(() => {
    localStorage.clear();
    window.location.hash = '';
  });

  it('resumes at the position saved after the jump (refresh or back)', () => {
    renderWithHash(jumpedAt + 60_000);
    expect(requestedVerse()).toBe(77);
  });

  it('follows the link when the saved position is older than the jump', () => {
    renderWithHash(jumpedAt - 60_000);
    expect(requestedVerse()).toBe(24);
  });
});
