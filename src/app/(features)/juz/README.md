# Juz Feature

Shared components and utilities:

- [AudioProvider](../../shared/player/context/AudioContext.tsx) – wraps pages to manage audio playback.
- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – chapter navigation from the features layout.
- [SettingsSidebar](../surah/[surahId]/components/SettingsSidebar.tsx), [TranslationPanel](../surah/[surahId]/components/translation-panel/TranslationPanel.tsx), and [WordLanguagePanel](../surah/[surahId]/components/WordLanguagePanel.tsx) – shared settings panels reused from the Surah feature.
- [QuranAudioPlayer](../../shared/player/QuranAudioPlayer.tsx) – bottom audio player for verse playback.
- [buildAudioUrl](../../../lib/audio/reciters.ts) – constructs URLs for reciter audio.
- [getSurahCoverUrl](../../../lib/api/chapters.ts) – fetches surah cover images for the player.
