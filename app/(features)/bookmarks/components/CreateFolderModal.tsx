'use client';

import { useState } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { FolderIcon, PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { Panel } from '@/app/shared/ui/Panel';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = ['Daily Reading', 'Memorization', 'Reflection', 'Favorite Verses'];

interface ModalHeaderProps {
  title: string;
  description: string;
}

const ModalHeader = ({ title, description }: ModalHeaderProps): React.JSX.Element => (
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

interface FolderInputProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
}

const FolderInput = ({ folderName, onFolderNameChange }: FolderInputProps): React.JSX.Element => (
  <div className="space-y-2">
    <label htmlFor="folder-name" className="block text-sm font-semibold text-foreground">
      Folder Name
    </label>
    <div className="relative">
      <input
        id="folder-name"
        type="text"
        value={folderName}
        onChange={(e) => onFolderNameChange(e.target.value)}
        placeholder="e.g., Daily Reading, Memorization, Reflection"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder-muted focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
        maxLength={50}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">
        {folderName.length}/50
      </div>
    </div>
    {folderName.length > 0 && (
      <div className="flex items-center gap-2 text-xs text-muted">
        <FolderIcon size={14} />
        <span>Preview: {folderName.trim()}</span>
      </div>
    )}
  </div>
);

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

const FormActions = ({
  onCancel,
  onSubmit,
  isSubmitDisabled,
}: FormActionsProps): React.JSX.Element => (
  <div className="flex justify-end gap-3 pt-2">
    <Button variant="ghost" onClick={onCancel} className="px-6 py-2.5">
      Cancel
    </Button>
    <Button
      type="submit"
      variant="primary"
      disabled={isSubmitDisabled}
      onClick={onSubmit}
      className="px-6 py-2.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <PlusIcon size={18} />
      <span>Create Folder</span>
    </Button>
  </div>
);

interface QuickSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const QuickSuggestions = ({
  suggestions,
  onSuggestionClick,
}: QuickSuggestionsProps): React.JSX.Element => (
  <div className="mt-8 pt-6 border-t border-border">
    <h3 className="text-sm font-semibold text-foreground mb-3">Quick Suggestions</h3>
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg hover:bg-accent/10 hover:border-accent/20 transition-colors duration-200 text-muted hover:text-foreground"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

export const CreateFolderModal = ({
  isOpen,
  onClose,
}: CreateFolderModalProps): React.JSX.Element => {
  const [folderName, setFolderName] = useState('');
  const { createFolder } = useBookmarks();

  const handleSubmit = (e?: React.FormEvent): void => {
    e?.preventDefault();
    if (folderName.trim()) {
      createFolder(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  const handleClose = (): void => {
    setFolderName('');
    onClose();
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setFolderName(suggestion);
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={handleClose}
      variant="modal-center"
      title=""
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="p-6">
        <ModalHeader title="Create New Folder" description="Organize your bookmarked verses" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <FolderInput folderName={folderName} onFolderNameChange={setFolderName} />
          <FormActions
            onCancel={handleClose}
            onSubmit={() => handleSubmit()}
            isSubmitDisabled={!folderName.trim()}
          />
        </form>

        <QuickSuggestions
          suggestions={QUICK_SUGGESTIONS}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </Panel>
  );
};
