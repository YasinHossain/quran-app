import juzData from '@/data/juz.json';

describe('juz.json', () => {
  it('has distinct ranges for first two juz', () => {
    expect(juzData[0].surahRange).not.toEqual(juzData[1].surahRange);
  });
});
