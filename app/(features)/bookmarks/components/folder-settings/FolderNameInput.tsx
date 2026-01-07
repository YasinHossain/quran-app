import React from 'react';

interface FolderNameInputProps {
  name: string;
  setName: (name: string) => void;
}

export const FolderNameInput = ({ name, setName }: FolderNameInputProps): React.JSX.Element => (
  <div className="mb-6">
    <label htmlFor="folder-name" className="block text-sm font-medium text-foreground mb-2">
      Folder Name
    </label>
    <input
      id="folder-name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full rounded-lg border border-border bg-interactive/60 px-4 py-3 text-foreground placeholder:text-muted focus:border-transparent focus:ring-2 focus:ring-accent focus:outline-none transition-colors duration-150"
      placeholder="Enter folder name"
      required
      maxLength={30}
    />
  </div>
);
