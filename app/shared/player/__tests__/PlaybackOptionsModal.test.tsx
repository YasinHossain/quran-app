import React, { useEffect } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaybackOptionsModal } from '@/app/shared/player/components/PlaybackOptionsModal';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { useAudio } from '@/app/shared/player/context/AudioContext';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

test('coerces decimal input to integer', async () => {
  const onClose = jest.fn();
  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  const startInput = screen.getByLabelText('Start') as HTMLInputElement;
  expect(startInput).toHaveAttribute('step', '1');
  fireEvent.change(startInput, { target: { value: '3.7' } });
  expect(startInput.value).toBe('3');
});

test('rejects decimal repeat values', async () => {
  const onClose = jest.fn();

  const Wrapper = () => {
    const { setRepeatOptions } = useAudio();
    useEffect(() => {
      setRepeatOptions((prev) => ({ ...prev, start: 1.5 }));
    }, [setRepeatOptions]);
    return (
      <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
    );
  };

  renderWithProviders(<Wrapper />);

  await screen.findByDisplayValue('1.5');
  await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByText('Please enter whole numbers only.')).toBeInTheDocument();
});
