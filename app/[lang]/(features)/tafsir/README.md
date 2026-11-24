# Tafsir Feature

Shared components and utilities:

- [SurahListSidebar](../../shared/SurahListSidebar.tsx) – navigation supplied by the features layout.
- [AudioProvider](../../shared/player/context/AudioContext.tsx) – wraps layout for audio state.
- [SettingsSidebar](../surah/[surahId]/components/SettingsSidebar.tsx) and [TafsirPanel](../surah/[surahId]/components/tafsir-panel/TafsirPanel.tsx) – reused UI panels from the Surah feature.
- [SettingsContext](../../providers/SettingsContext.tsx) – provides user translation and word settings.
- [useSingleVerse](../../shared/hooks/useSingleVerse.ts) and [GetTafsirContentUseCase](../../../src/application/use-cases/GetTafsirContent.ts) – utilities to load verse text and tafsir content.
