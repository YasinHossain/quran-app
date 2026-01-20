import {
  BookmarkAlreadyExistsError,
  BookmarkNotFoundError,
  DomainError,
  InvalidPaginationError,
  InvalidSearchCriteriaError,
  InvalidTafsirRequestError,
  SurahNotFoundError,
  TafsirContentLoadError,
  UnauthorizedAccessError,
  UnauthorizedBookmarkError,
  VerseNotFoundError,
} from '@/src/domain/errors/DomainErrors';

describe('DomainErrors', () => {
  it('sets name and timestamp on DomainError subclasses', () => {
    const err = new VerseNotFoundError('1:1');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
    expect(err.name).toBe('VerseNotFoundError');
    expect(err.timestamp).toBeInstanceOf(Date);
  });

  it('formats error messages with context', () => {
    expect(new BookmarkAlreadyExistsError('u', 1, 2).message).toContain('u');
    expect(new BookmarkAlreadyExistsError('u', 1, 2).message).toContain('1:2');
    expect(new VerseNotFoundError('1:1').message).toContain('1:1');
    expect(new BookmarkNotFoundError('b1').message).toContain('b1');
    expect(new SurahNotFoundError(5).message).toContain('5');
  });

  it('supports custom messages where applicable', () => {
    expect(new InvalidPaginationError('bad').message).toBe('Invalid pagination: bad');
    expect(new InvalidSearchCriteriaError('bad').message).toBe('Invalid search criteria: bad');
    expect(new UnauthorizedAccessError('x').message).toBe('Unauthorized access: x');
    expect(new UnauthorizedBookmarkError('x').message).toBe('Unauthorized: x');
    expect(new InvalidTafsirRequestError().message).toBe('Verse key and tafsir ID are required');
    expect(new InvalidTafsirRequestError('custom').message).toBe('custom');
    expect(new TafsirContentLoadError().message).toBe(
      'Failed to load tafsir content. Please try again.'
    );
    expect(new TafsirContentLoadError('custom').message).toBe('custom');
  });
});
