import React from 'react';
import { useTranslation } from 'react-i18next';

import { UnifiedInput } from '@/app/shared/ui/inputs/UnifiedInput';

interface FolderNameInputProps {
  name: string;
  setName: (name: string) => void;
}

export const FolderNameInput = ({ name, setName }: FolderNameInputProps): React.JSX.Element => (
  <div className="mb-6">
    <FolderNameField name={name} setName={setName} />
  </div>
);

function FolderNameField({ name, setName }: FolderNameInputProps): React.JSX.Element {
  const { t } = useTranslation();
  const label = t('bookmarks_folder_name_placeholder');

  return (
    <UnifiedInput
      id="folder-name"
      label={label}
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder={label}
      required
      maxLength={30}
    />
  );
}
