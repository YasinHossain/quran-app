import React from 'react';
import type { ReactElement } from 'react';

import { SelectionBox } from '@/app/shared/SelectionBox';

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
