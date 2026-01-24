'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { CloseIcon } from '@/app/shared/icons';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader = ({ onClose }: ModalHeaderProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{t('delete_folder')}</h2>
          <p className="text-sm text-muted">{t('delete_folder_subtitle')}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1.5 rounded-full hover:bg-interactive-hover transition-colors flex items-center justify-center text-muted hover:text-foreground"
        aria-label={t('close')}
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
};
