'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';

interface ModalHeaderProps {
  title: string;
  description: string;
}

export const ModalHeader = ({ title, description }: ModalHeaderProps): React.JSX.Element => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
      <FolderIcon size={24} className="text-accent" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
  </div>
);
