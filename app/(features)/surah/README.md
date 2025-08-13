# Surah Feature

Shared components and utilities:

- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – chapter navigation supplied by the features layout.
- [AudioProvider](../../shared/player/context/AudioContext.tsx) – wraps layout to expose audio state.
- [VerseActions](../../shared/VerseActions.tsx) and [VerseArabic](../../shared/VerseArabic.tsx) – shared verse UI elements.
- [SettingsContext](../../providers/SettingsContext.tsx) and [BookmarkContext](../../providers/BookmarkContext.tsx) – manage user settings and bookmarks.
- [Spinner](../../shared/Spinner.tsx) – loading indicator during verse fetches.
- [QuranAudioPlayer](../../shared/player/QuranAudioPlayer.tsx) – floating audio player for active verses.
- [getVersesByChapter](../../../lib/api/verses.ts), [buildAudioUrl](../../../lib/audio/reciters.ts), and [getSurahCoverUrl](../../../lib/api/chapters.ts) – data and audio helpers.
