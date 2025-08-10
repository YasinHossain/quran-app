import { stripHtml } from '@/lib/text/stripHtml';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    const result = stripHtml('<p>foo <b>bar</b></p>');
    expect(result).toBe('foo bar');
  });
});
