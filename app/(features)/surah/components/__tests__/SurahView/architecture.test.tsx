import { renderSurahView } from './test-utils';

describe('SurahView architecture', () => {
  it('handles body overflow management', () => {
    const { unmount } = renderSurahView();
    expect(document.body.style.overflow).toBe('');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
