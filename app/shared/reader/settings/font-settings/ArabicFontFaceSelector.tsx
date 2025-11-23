import React from 'react';

import { SelectionBox } from '@/app/shared/SelectionBox';

import type { ReactElement } from 'react';

interface ArabicFontFaceSelectorProps {
  id?: string;
  label: string;
  value: string;
  onClick: () => void;
}

export function ArabicFontFaceSelector({
  id,
  label,
  value,
  onClick,
}: ArabicFontFaceSelectorProps): ReactElement {
  return (
    <div suppressHydrationWarning>
      <SelectionBox {...(id ? { id } : {})} label={label} value={value} onClick={onClick} />
    </div>
  );
}
