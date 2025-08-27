/**
 * Example: How to Update React Components to Use Clean Architecture
 *
 * This shows how to migrate from the old BookmarkContext pattern
 * to the new clean architecture services.
 */

import React, { useEffect } from 'react';
import { useBookmarkService } from '../application/hooks/useBookmarkService';

// BEFORE: Using old BookmarkContext
/*
import { useBookmarks } from '@/app/providers/BookmarkContext';

const OldBookmarkComponent = () => {
  const { folders, addBookmark, removeBookmark } = useBookmarks();
  // Mixed concerns: React state management + business logic
};
*/

// AFTER: Using Clean Architecture
const NewBookmarkComponent = () => {
  const {
    folders,
    pinnedVerses,
    loading,
    error,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    togglePinned,
    createFolder,
    refreshData,
  } = useBookmarkService();

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleBookmarkVerse = async (verseId: string) => {
    try {
      const action = await toggleBookmark(verseId);
      console.log(`Verse ${action}: ${verseId}`);
    } catch (error) {
      console.error('Failed to bookmark verse:', error);
    }
  };

  const handlePinVerse = async (verseId: string) => {
    try {
      const action = await togglePinned(verseId);
      console.log(`Verse ${action}: ${verseId}`);
    } catch (error) {
      console.error('Failed to pin verse:', error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const folder = await createFolder(name, {
        color: '#7C3AED',
        icon: 'bookmark',
      });
      console.log('Folder created:', folder.name);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Bookmarks ({folders.length} folders)</h2>

      <div>
        <h3>Folders:</h3>
        {folders.map((folder) => (
          <div key={folder.id}>
            <h4>
              {folder.name} ({folder.getBookmarkCount()} bookmarks)
            </h4>
            {folder.bookmarks.map((bookmark) => (
              <div key={bookmark.id}>
                {bookmark.getDisplayReference()}
                <button onClick={() => removeBookmark(bookmark.verseId, folder.id)}>Remove</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <h3>Pinned Verses ({pinnedVerses.length}):</h3>
        {pinnedVerses.map((verse) => (
          <div key={verse.id}>
            {verse.getDisplayReference()}
            <button onClick={() => handlePinVerse(verse.verseId)}>Unpin</button>
          </div>
        ))}
      </div>

      <div>
        <button onClick={() => handleBookmarkVerse('2:255')}>Bookmark Ayat al-Kursi</button>
        <button onClick={() => handlePinVerse('1:1')}>Pin Al-Fatiha</button>
        <button onClick={() => handleCreateFolder('My Favorites')}>Create Folder</button>
      </div>
    </div>
  );
};

export default NewBookmarkComponent;

/*
Migration Steps for Your Existing Components:

1. Replace useBookmarks() with useBookmarkService()
2. Remove BookmarkProvider dependency 
3. Use the service methods instead of context methods
4. Business logic is now handled in domain/application layers
5. React components become pure presentation layer

Benefits:
- Clean separation of concerns
- Easy to test (mock the service)
- Reusable across different apps
- Type-safe with domain entities
*/
