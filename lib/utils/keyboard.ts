import type React from 'react';
export const handleKeyboardActivation = (e: React.KeyboardEvent, callback?: () => void): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback?.();
  }
};
