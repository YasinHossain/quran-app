import React, { memo } from 'react';

interface Props {
  onClose: () => void;
  onApply: () => void;
}

export const ModalFooter = memo(function ModalFooter({
  onClose,
  onApply,
}: Props): React.JSX.Element {
  return (
    <div className="mt-5 flex items-center justify-between text-sm">
      <div className="text-muted">Tips: Space • ←/→ seek • ↑/↓ volume</div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-xl bg-surface hover:bg-interactive-hover text-foreground"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-accent text-on-accent hover:opacity-90"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
});
