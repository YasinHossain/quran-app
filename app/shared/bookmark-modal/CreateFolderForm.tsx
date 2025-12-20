'use client';

import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';

import { CloseIcon, CheckIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface CreateFolderFormProps {
  newFolderName: string;
  onNameChange: (name: string) => void;
  onCreateFolder: () => void;
  onCancel: () => void;
}

interface ActionButtonsProps {
  newFolderName: string;
  onCancel: () => void;
}

const ActionButtons = memo(function ActionButtons({
  newFolderName,
  onCancel,
}: ActionButtonsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">


      <button
        type="submit"
        disabled={!newFolderName.trim()}
        className={cn(
          'p-1.5 rounded-lg transition-colors flex items-center justify-center',
          newFolderName.trim()
            ? 'text-accent hover:bg-interactive-hover'
            : 'text-muted cursor-not-allowed',
          touchClasses.focus
        )}
        aria-label="Create folder"
      >
        <CheckIcon size={16} />
      </button>
    </div>
  );
});

export const CreateFolderForm = memo(function CreateFolderForm({
  newFolderName,
  onNameChange,
  onCreateFolder,
  onCancel,
}: CreateFolderFormProps): React.JSX.Element {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onCreateFolder();
    },
    [onCreateFolder]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 pl-4 pr-3 py-3 bg-interactive/60 rounded-lg border border-border focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent transition-all duration-300"
    >
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Folder name"
        className={cn(
          'flex-1 min-w-0 bg-surface/0 text-foreground placeholder-muted',
          'focus:outline-none'
        )}
      />
      <ActionButtons newFolderName={newFolderName} onCancel={onCancel} />
    </motion.form>
  );
});
