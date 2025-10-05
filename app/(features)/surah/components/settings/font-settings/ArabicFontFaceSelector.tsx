import React from 'react';

import { SelectionBox } from '@/app/shared/SelectionBox';

import type { ReactElement } from 'react';

interface ArabicFontFaceSelectorProps {
  label: string;
  value: string;
  onClick: () => void;
}

export function ArabicFontFaceSelector({
  label,
  value,
  onClick,
}: ArabicFontFaceSelectorProps): ReactElement {
  return (
    <div suppressHydrationWarning>
      <SelectionBox label={label} value={value} onClick={onClick} />
    </div>
  );
}
