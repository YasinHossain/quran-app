'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, CheckIcon } from '@/presentation/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils';

interface CreateFolderFormProps {
  newFolderName: string;
  onNameChange: (name: string) => void;
  onCreateFolder: () => void;
  onCancel: () => void;
}

const CreateFolderForm: React.FC<CreateFolderFormProps> = ({
  newFolderName,
  onNameChange,
  onCreateFolder,
  onCancel,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateFolder();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 p-4 bg-surface-secondary rounded-2xl border border-border"
    >
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Folder name"
        className={cn(
          'flex-1 bg-transparent text-foreground placeholder-muted',
          'focus:outline-none'
        )}
      />

      <div className="flex items-center gap-1">
        <button
          type="submit"
          disabled={!newFolderName.trim()}
          className={cn(
            'p-2 rounded-full transition-colors',
            newFolderName.trim()
              ? 'text-accent hover:bg-accent/10'
              : 'text-muted cursor-not-allowed',
            touchClasses.target,
            touchClasses.focus
          )}
          aria-label="Create folder"
        >
          <CheckIcon size={16} />
        </button>

        <button
          type="button"
          onClick={onCancel}
          className={cn(
            'p-2 rounded-full hover:bg-interactive text-muted transition-colors',
            touchClasses.target,
            touchClasses.focus
          )}
          aria-label="Cancel"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </motion.form>
  );
};

export default CreateFolderForm;
