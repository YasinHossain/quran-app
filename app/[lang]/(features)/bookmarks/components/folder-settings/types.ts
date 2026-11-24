import { Folder } from '@/types';

export interface UseFolderSettingsParams {
  folder: Folder | null;
  onClose: () => void;
  isOpen: boolean;
  mode: 'create' | 'edit';
}

export interface UseFolderSettingsResult {
  name: string;
  setName: (name: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getModalTitle: () => string;
  submitLabel: string;
  submittingLabel: string;
}

export interface UseFolderSettingsSubmitParams {
  mode: 'create' | 'edit';
  folder: Folder | null;
  renameFolder: (id: string, name: string, color?: string) => void;
  createFolder: (name: string, color?: string) => void;
  onClose: () => void;
  setIsSubmitting: (v: boolean) => void;
  name: string;
  selectedColor: string;
}

export interface InitStateArgs {
  folder: Folder | null;
  isOpen: boolean;
  mode: 'create' | 'edit';
  setName: (v: string) => void;
  setSelectedColor: (v: string) => void;
}
