# Home Feature

Shared components and utilities:

- [ThemeContext](../../providers/ThemeContext.tsx) – manages light and dark modes.
- [SettingsContext](../../providers/SettingsContext.tsx) – Verse of the Day uses translation preferences.
- [Spinner](../../shared/Spinner.tsx) – loading indicator for async content.
- [Shared icons](../../shared/icons) – provides SunIcon, MoonIcon, and SearchIcon.
- [getRandomVerse](../../../lib/api/verses.ts) – retrieves verses for the daily display.
- [applyTajweed](../../../lib/text/tajweed.ts), [sanitizeHtml](../../../lib/text/sanitizeHtml.ts), and [stripHtml](../../../lib/text/stripHtml.ts) – process verse text before rendering.
- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – chapter navigation supplied by the features layout.
