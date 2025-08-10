import { stripHtml } from '../stripHtml';

describe('stripHtml', () => {
  it('removes HTML tags and returns plain text', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    expect(stripHtml(input)).toBe('Hello world');
  });

  it('handles strings with only tags', () => {
    expect(stripHtml('<div><span></span></div>')).toBe('');
  });
});
