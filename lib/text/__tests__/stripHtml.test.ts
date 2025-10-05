import { stripHtml } from '@/lib/text/stripHtml';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    const result = stripHtml('<p>foo <b>bar</b></p>');
    expect(result).toBe('foo bar');
  });

  it('removes simple HTML tags', () => {
    const input = '<p>Hello, <b>World</b>!</p>';
    const expected = 'Hello, World!';
    expect(stripHtml(input)).toBe(expected);
  });

  it('returns an empty string for null or undefined input', () => {
    expect(stripHtml(null as unknown as string)).toBe('');
    expect(stripHtml(undefined as unknown as string)).toBe('');
  });

  it('handles strings with no HTML', () => {
    const input = 'This is a plain string.';
    expect(stripHtml(input)).toBe(input);
  });

  it('handles complex HTML', () => {
    const input = '<div><span>Some text</span><a href="#"> and a link</a></div>';
    const expected = 'Some text and a link';
    expect(stripHtml(input)).toBe(expected);
  });

  it('strips script and style tags but keeps their content', () => {
    const input =
      '<p>Keep this.</p><script>alert("Remove this!");</script><style>.remove { color: red; }</style>';
    const expected = 'Keep this.alert("Remove this!");.remove { color: red; }';
    expect(stripHtml(input)).toBe(expected);
  });
});
