import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { UnifiedModal } from '@/app/shared/components/modal/UnifiedModal';

// Mock framer-motion to avoid animation timing issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Strip motion-only props to avoid React warnings
      const domProps = { ...props };
      delete domProps.variants;
      delete domProps.initial;
      delete domProps.animate;
      delete domProps.exit;
      delete domProps.transition;
      return React.createElement('div', domProps, children);
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('UnifiedModal', () => {
  it('does not render when closed', () => {
    render(
      <UnifiedModal isOpen={false} onClose={jest.fn()}>
        Content
      </UnifiedModal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog content when open', async () => {
    render(
      <UnifiedModal isOpen onClose={jest.fn()} ariaLabel="Test modal">
        Content
      </UnifiedModal>
    );

    expect(await screen.findByRole('dialog', { name: 'Test modal' })).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes on Escape by default', async () => {
    const onClose = jest.fn();
    render(
      <UnifiedModal isOpen onClose={onClose} ariaLabel="Test modal">
        Content
      </UnifiedModal>
    );

    await screen.findByRole('dialog', { name: 'Test modal' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when disabled', async () => {
    const onClose = jest.fn();
    render(
      <UnifiedModal isOpen onClose={onClose} closeOnEscape={false} ariaLabel="Test modal">
        Content
      </UnifiedModal>
    );

    await screen.findByRole('dialog', { name: 'Test modal' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on overlay click by default', async () => {
    const onClose = jest.fn();
    render(
      <UnifiedModal
        isOpen
        onClose={onClose}
        ariaLabel="Test modal"
        backdropClassName="test-backdrop"
      >
        Content
      </UnifiedModal>
    );

    await screen.findByRole('dialog', { name: 'Test modal' });

    const backdrop = document.querySelector('.test-backdrop');
    expect(backdrop).toBeInTheDocument();
    if (!backdrop) return;

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on overlay click when disabled', async () => {
    const onClose = jest.fn();
    render(
      <UnifiedModal
        isOpen
        onClose={onClose}
        closeOnOverlayClick={false}
        ariaLabel="Test modal"
        backdropClassName="test-backdrop"
      >
        Content
      </UnifiedModal>
    );

    await screen.findByRole('dialog', { name: 'Test modal' });

    const backdrop = document.querySelector('.test-backdrop');
    expect(backdrop).toBeInTheDocument();
    if (!backdrop) return;

    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });
});
