'use client';

import React from 'react';

import { ColorSelector } from '../folder-settings/ColorSelector';
import { FolderNameInput } from '../folder-settings/FolderNameInput';
import { IconSelector } from '../folder-settings/IconSelector';
import { ModalActions } from '../folder-settings/ModalActions';

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
