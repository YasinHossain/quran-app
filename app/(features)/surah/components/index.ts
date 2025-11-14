// Main components
export { SurahView } from './SurahView.client';
export { Verse as VerseCard } from './VerseCard';
export { SurahVerseList } from './SurahVerseList';
export { SurahAudioPlayer } from './SurahAudioPlayer';
export { CollapsibleSection } from './CollapsibleSection';
export { WordLanguagePanel } from './WordLanguagePanel';

// Settings components (relocated to shared reader module)
export {
  SettingsContent,
  SettingsSidebar,
  ReadingSettings,
  FontSettings,
} from '@/app/shared/reader/settings';

// Panel components
export { TafsirPanel } from './panels/tafsir-panel';
export { TranslationPanel } from './panels/translation-panel';

// Re-export panel utilities
export * from './panels/tafsir-panel';
export * from './panels/translation-panel';
