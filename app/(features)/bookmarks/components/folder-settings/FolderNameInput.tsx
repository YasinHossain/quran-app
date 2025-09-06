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
      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
      placeholder="Enter folder name"
      required
    />
  </div>
);
