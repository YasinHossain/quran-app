import React from 'react';

import { UnifiedInput } from '@/app/shared/ui/inputs/UnifiedInput';

interface FolderNameInputProps {
  name: string;
  setName: (name: string) => void;
}

export const FolderNameInput = ({ name, setName }: FolderNameInputProps): React.JSX.Element => (
  <div className="mb-6">
    <UnifiedInput
      id="folder-name"
      label="Folder Name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter folder name"
      required
      maxLength={30}
    />
  </div>
);
