import juzData from '@/data/juz.json';

describe('juz.json', () => {
  it('has distinct ranges for first two juz', () => {
    expect(juzData[0]!.surahRange).not.toEqual(juzData[1]!.surahRange);
  });

  it('has 30 unique entries', () => {
    expect(juzData).toHaveLength(30);
    const numbers = juzData.map((j) => j.number);
    expect(new Set(numbers).size).toBe(30);
  });
});
