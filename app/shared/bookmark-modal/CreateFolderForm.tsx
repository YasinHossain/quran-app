'use client';

import { memo, useCallback } from 'react';

import { CheckIcon } from '@/app/shared/icons';
import { UnifiedInput } from '@/app/shared/ui/inputs/UnifiedInput';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface CreateFolderFormProps {
  newFolderName: string;
  onNameChange: (name: string) => void;
  onCreateFolder: () => void;
}

interface ActionButtonsProps {
  newFolderName: string;
}

const ActionButtons = memo(function ActionButtons({
  newFolderName,
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
}: CreateFolderFormProps): React.JSX.Element {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onCreateFolder();
    },
    [onCreateFolder]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="transition-all duration-300 animate-fade-in"
    >
      <UnifiedInput
        variant="compact"
        type="text"
        value={newFolderName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Folder name"
        maxLength={30}
        wrapperClassName="transition-all duration-300"
        rightSlot={<ActionButtons newFolderName={newFolderName} />}
      />
    </form>
  );
});
