import type React from 'react';
import { handleKeyboardActivation } from '../keyboard';

describe('handleKeyboardActivation', () => {
  it('calls callback on Enter', () => {
    const cb = jest.fn();
    const event = { key: 'Enter', preventDefault: jest.fn() } as unknown as React.KeyboardEvent;
    handleKeyboardActivation(event, cb);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(cb).toHaveBeenCalled();
  });

  it('calls callback on space', () => {
    const cb = jest.fn();
    const event = { key: ' ', preventDefault: jest.fn() } as unknown as React.KeyboardEvent;
    handleKeyboardActivation(event, cb);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(cb).toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const cb = jest.fn();
    const event = { key: 'Escape', preventDefault: jest.fn() } as unknown as React.KeyboardEvent;
    handleKeyboardActivation(event, cb);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(cb).not.toHaveBeenCalled();
  });
});
