import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';

import { PlaybackOptionsModal } from '@/app/shared/player/components/PlaybackOptionsModal';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

jest.mock('@/app/shared/navigation/hooks/useSurahNavigationData', () => ({
  useSurahNavigationData: () => ({
    chapters: [
      { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
      { id: 2, name_simple: 'Al-Baqarah', verses_count: 286 },
    ],
    surahs: [],
    isLoading: false,
    error: undefined,
  }),
}));

beforeAll(() => {
  setMatchMedia(false);
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

  const Wrapper = (): React.ReactElement => {
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

test('requires surah and verse when using single mode', async () => {
  const onClose = jest.fn();

  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  await userEvent.click(screen.getByRole('button', { name: /^single$/i }));

  expect(screen.getByLabelText('Surah')).toBeInTheDocument();
  expect(screen.getByLabelText('Verse')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Apply' }));

  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByText('Select a surah and verse to repeat.')).toBeInTheDocument();
});

test('hides play count in single mode', async () => {
  const onClose = jest.fn();
  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  await userEvent.click(screen.getByRole('button', { name: /^single$/i }));

  expect(screen.queryByLabelText('Play count')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Repeat each')).toBeInTheDocument();
});
