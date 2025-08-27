# Page Feature

Shared components and utilities:

- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – navigation sidebar supplied by the features layout.
- [AudioProvider](../../shared/player/context/AudioContext.tsx) – wraps layout to manage audio playback.
- [Verse](../surah/[surahId]/components/Verse.tsx) – shared verse renderer reused for page listings.
- [SettingsSidebar](../surah/[surahId]/components/SettingsSidebar.tsx), [TranslationPanel](../surah/[surahId]/components/translation-panel/TranslationPanel.tsx), and [WordLanguagePanel](../surah/[surahId]/components/WordLanguagePanel.tsx) – settings panels from the Surah feature.
- [QuranAudioPlayer](../../shared/player/QuranAudioPlayer.tsx) – displays the current verse track.
- [getVersesByPage](../../../lib/api/verses.ts) and [buildAudioUrl](../../../lib/audio/reciters.ts) – fetch page data and construct audio URLs.
