import React, { memo } from 'react';
import { Button } from '@/app/shared/ui/Button';

interface Props {
  onClose: () => void;
  onApply: () => void;
}

export const ModalFooter = memo(function ModalFooter({
  onApply,
}: Props): React.JSX.Element {
  return (
    <div className="mt-5 flex items-center justify-end">
      <Button
        onClick={onApply}
        className="rounded-lg px-5"
      >
        Apply
      </Button>
    </div>
  );
});
