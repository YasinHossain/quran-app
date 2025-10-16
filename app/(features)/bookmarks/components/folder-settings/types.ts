import { Folder } from '@/types';

export type FolderSettingsMode = 'rename' | 'customize';

export interface UseFolderSettingsParams {
  folder: Folder | null;
  mode: FolderSettingsMode;
  onClose: () => void;
  isOpen: boolean;
}

export interface UseFolderSettingsResult {
  name: string;
  setName: (name: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getModalTitle: () => string;
}

export interface UseFolderSettingsSubmitParams {
  mode: FolderSettingsMode;
  folder: Folder | null;
  renameFolder: (id: string, name: string, color: string, icon: string) => void;
  onClose: () => void;
  setIsSubmitting: (v: boolean) => void;
  name: string;
  selectedColor: string;
  selectedIcon: string;
}

export interface InitStateArgs {
  folder: Folder | null;
  isOpen: boolean;
  setName: (v: string) => void;
  setSelectedColor: (v: string) => void;
  setSelectedIcon: (v: string) => void;
}
