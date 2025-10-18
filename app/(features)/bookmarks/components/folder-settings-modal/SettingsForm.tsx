'use client';

import React from 'react';

import { ColorSelector } from '@/app/(features)/bookmarks/components/folder-settings/ColorSelector';
import { FolderNameInput } from '@/app/(features)/bookmarks/components/folder-settings/FolderNameInput';
import { ModalActions } from '@/app/(features)/bookmarks/components/folder-settings/ModalActions';

interface SettingsFormProps {
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

export const SettingsForm = (props: SettingsFormProps): React.JSX.Element => {
  const { name, setName, selectedColor, setSelectedColor, isSubmitting, onClose, handleSubmit } =
    props;

  return (
    <form onSubmit={handleSubmit}>
      <FolderNameInput name={name} setName={setName} />
      <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      <ModalActions isSubmitting={isSubmitting} onClose={onClose} />
    </form>
  );
};
