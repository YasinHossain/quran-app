import { foldSearchCase } from '@/lib/text/foldSearchCase';

describe('foldSearchCase', () => {
  it('lets Turkish dotted and dotless i match a plain i', () => {
    expect(foldSearchCase('Al-Insan').includes(foldSearchCase('İnsan'))).toBe(true);
    expect(foldSearchCase('YASİN')).toBe('yasin');
    expect(foldSearchCase('ıhlas')).toBe('ihlas');
  });
});
