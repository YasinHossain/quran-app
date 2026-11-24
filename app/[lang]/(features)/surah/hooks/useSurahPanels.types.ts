export interface SurahPanelOption {
  id: number;
  name: string;
}

export type PanelControls = {
  isTranslationPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  isWordLanguagePanelOpen: boolean;
  openWordLanguagePanel: () => void;
  closeWordLanguagePanel: () => void;
  isMushafPanelOpen: boolean;
  openMushafPanel: () => void;
  closeMushafPanel: () => void;
};
