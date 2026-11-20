# Surah Feature

Shared components and utilities:

- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – chapter navigation supplied by the features layout.
- [AudioProvider](../../shared/player/context/AudioContext.tsx) – wraps layout to expose audio state.
- [VerseActions](../../shared/VerseActions.tsx) and [VerseArabic](../../shared/VerseArabic.tsx) – shared verse UI elements.
- [SettingsContext](../../providers/SettingsContext.tsx) and [BookmarkContext](../../providers/BookmarkContext.tsx) – manage user settings and bookmarks.
- [Spinner](../../shared/Spinner.tsx) – loading indicator during verse fetches.
- [QuranAudioPlayer](../../shared/player/QuranAudioPlayer.tsx) – floating audio player for active verses.
- [getVersesByChapter](../../../lib/api/verses.ts), [buildAudioUrl](../../../lib/audio/reciters.ts), and [getSurahCoverUrl](../../../lib/api/chapters.ts) – data and audio helpers.

URLs:

- Canonical surah, verse and tafsir URLs use the surah slug from
  [`lib/seo/surahSlugs.ts`](../../../lib/seo/surahSlugs.ts): `/surah/al-baqarah`,
  `/surah/al-baqarah/255` (verse page, `[surahId]/[verseId]/page.tsx`), `/tafsir/al-baqarah/255`.
  Build links with `buildSurahRoute`/`buildVerseRoute`/`buildTafsirRoute`, which accept a number.
- `proxy.ts` sends numbers, loose spellings (`/surah/baqarah`) and the `/2/255` shortcut to the
  canonical URL with one 308. `#startVerse=` stays for in-reader jumps.
