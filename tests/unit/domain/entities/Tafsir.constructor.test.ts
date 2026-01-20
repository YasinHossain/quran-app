import { Tafsir } from '@/src/domain/entities';

describe('Tafsir', () => {
  it('validates input on construction', () => {
    expect(() => new Tafsir({ id: 0, name: 'T', lang: 'english' })).toThrow();
    expect(() => new Tafsir({ id: 1, name: '', lang: 'english' })).toThrow();
    expect(() => new Tafsir({ id: 1, name: 'T', lang: '' })).toThrow();
  });

  it('exposes getters and formatting helpers', () => {
    const tafsir = new Tafsir({
      id: 10,
      name: 'Ibn Kathir',
      lang: 'english',
      authorName: 'Ibn Kathir',
      slug: 'ibn-kathir',
    });

    expect(tafsir.id).toBe(10);
    expect(tafsir.name).toBe('Ibn Kathir');
    expect(tafsir.language).toBe('english');
    expect(tafsir.authorName).toBe('Ibn Kathir');
    expect(tafsir.slug).toBe('ibn-kathir');
    expect(tafsir.displayName).toBe('Ibn Kathir');
    expect(tafsir.formattedLanguage).toBe('English');
  });

  it('matches languages and search terms case-insensitively', () => {
    const tafsir = new Tafsir({
      id: 11,
      name: 'Tafsir Name',
      lang: 'Bangla',
      authorName: 'Some Author',
    });

    expect(tafsir.isInLanguage('bangla')).toBe(true);
    expect(tafsir.isInLanguage('ENGLISH')).toBe(false);

    expect(tafsir.matchesSearch('name')).toBe(true);
    expect(tafsir.matchesSearch('BANGLA')).toBe(true);
    expect(tafsir.matchesSearch('author')).toBe(true);
    expect(tafsir.matchesSearch('missing')).toBe(false);
  });

  it('assigns language priority for sorting', () => {
    expect(new Tafsir({ id: 1, name: 'A', lang: 'english' }).getLanguagePriority()).toBe(0);
    expect(new Tafsir({ id: 2, name: 'B', lang: 'bengali' }).getLanguagePriority()).toBe(1);
    expect(new Tafsir({ id: 3, name: 'C', lang: 'Bangla' }).getLanguagePriority()).toBe(1);
    expect(new Tafsir({ id: 4, name: 'D', lang: 'arabic' }).getLanguagePriority()).toBe(2);
    expect(new Tafsir({ id: 5, name: 'E', lang: 'urdu' }).getLanguagePriority()).toBe(3);
  });

  it('serializes/deserializes and compares by id', () => {
    const tafsir = new Tafsir({ id: 123, name: 'X', lang: 'english', authorName: 'Y' });
    expect(tafsir.toJSON()).toEqual({ id: 123, name: 'X', lang: 'english', authorName: 'Y' });

    const restored = Tafsir.fromJSON(tafsir.toJSON());
    expect(restored.equals(tafsir)).toBe(true);
    expect(new Tafsir({ id: 999, name: 'X', lang: 'english' }).equals(tafsir)).toBe(false);
  });
});

