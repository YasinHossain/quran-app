import { validId, validResourceId } from './Translation/test-utils';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Translation preview and length', () => {
  it('getPreview returns full text when within limit and truncates long text', () => {
    const short = new Translation({ id: validId, resourceId: validResourceId, text: 'Short text here' });
    expect(short.getPreview(5)).toBe('Short text here');

    const longText = 'This is a very long text that should be truncated when preview is requested';
    const long = new Translation({ id: validId, resourceId: validResourceId, text: longText });
    expect(long.getPreview(5)).toBe('This is a very long...');
  });

  it('uses default word limit of 10', () => {
    const text = 'This is a very long text that has more than ten words in it';
    const t = new Translation({ id: validId, resourceId: validResourceId, text });
    expect(t.getPreview()).toBe('This is a very long text that has more than...');
  });

  it('handles exactly the word limit', () => {
    const t = new Translation({
      id: validId,
      resourceId: validResourceId,
      text: 'One two three four five',
    });
    expect(t.getPreview(5)).toBe('One two three four five');
  });

  it('isLong detects long translations', () => {
    const long = new Translation({
      id: validId,
      resourceId: validResourceId,
      text: Array(51).fill('word').join(' '),
    });
    expect(long.isLong()).toBe(true);
    const notLong = new Translation({
      id: validId,
      resourceId: validResourceId,
      text: Array(50).fill('word').join(' '),
    });
    expect(notLong.isLong()).toBe(false);
  });
});
