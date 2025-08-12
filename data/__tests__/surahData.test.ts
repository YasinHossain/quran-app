import surahs from '@/data/surahs.json';

describe('surahs.json', () => {
  it('contains 114 surahs with required fields', () => {
    expect(surahs).toHaveLength(114);
    surahs.forEach((surah) => {
      expect(surah).toEqual(
        expect.objectContaining({
          number: expect.any(Number),
          arabicName: expect.any(String),
          verses: expect.any(Number),
          meaning: expect.any(String),
        })
      );
    });
  });
});
