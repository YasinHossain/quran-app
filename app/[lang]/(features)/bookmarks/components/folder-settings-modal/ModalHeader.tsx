'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CloseIcon } from '@/app/shared/icons';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps): React.JSX.Element => (
  <div className="flex items-center justify-between mb-6">
    <h2 id="folder-settings-title" className="text-xl font-semibold text-foreground">
      {title}
    </h2>
    <CloseButton onClose={onClose} />
  </div>
);

function CloseButton({ onClose }: { onClose: () => void }): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClose}
      className="shrink-0 p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center text-muted hover:text-foreground"
      aria-label={t('close')}
    >
      <CloseIcon size={18} />
    </button>
  );
}
