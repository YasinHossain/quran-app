// app/(features)/bookmarks/page.tsx
'use client';
import BookmarkedVersesList from './components/BookmarkedVersesList';

const BookmarksPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bookmarked Verses</h1>
      <BookmarkedVersesList />
    </div>
  );
};

export default BookmarksPage;
