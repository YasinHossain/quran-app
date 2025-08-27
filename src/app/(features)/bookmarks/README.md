# Bookmarks Feature

Shared components and utilities:

- [BookmarkContext](../../providers/BookmarkContext.tsx) – provides access to saved verse IDs.
- [SettingsContext](../../providers/SettingsContext.tsx) – supplies current translation settings.
- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – navigation sidebar from the features layout.
- [getVerseById](../../../lib/api/verses.ts) – fetches full verse data for each bookmark.
- [sanitizeHtml](../../../lib/text/sanitizeHtml.ts) – cleans verse HTML before rendering.
