'use client';

import React from 'react';

import { ColorSelector } from '@/app/(features)/bookmarks/components/folder-settings/ColorSelector';
import { FolderNameInput } from '@/app/(features)/bookmarks/components/folder-settings/FolderNameInput';
import { IconSelector } from '@/app/(features)/bookmarks/components/folder-settings/IconSelector';
import { ModalActions } from '@/app/(features)/bookmarks/components/folder-settings/ModalActions';

interface SettingsFormProps {
  mode: 'edit' | 'rename' | 'customize';
  name: string;
  setName: (name: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const SettingsForm = ({
  mode,
  name,
  setName,
  selectedColor,
  setSelectedColor,
  selectedIcon,
  setSelectedIcon,
  isSubmitting,
  onClose,
  handleSubmit,
}: SettingsFormProps): React.JSX.Element => (
  <form onSubmit={handleSubmit}>
    <FolderNameInput name={name} setName={setName} />
    {mode === 'customize' && (
      <>
        <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        <IconSelector selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
      </>
    )}
    <ModalActions isSubmitting={isSubmitting} onClose={onClose} />
  </form>
);
