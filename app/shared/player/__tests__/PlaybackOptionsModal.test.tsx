import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';

import { PlaybackOptionsModal } from '@/app/shared/player/components/PlaybackOptionsModal';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen, waitFor } from '@/app/testUtils/renderWithProviders';

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

  const repeatEachLabel = screen.getByText('repeat_each');
  const repeatEachField = repeatEachLabel.closest('div');
  const repeatEachInput = repeatEachField?.querySelector('input') as HTMLInputElement;
  expect(repeatEachInput).toHaveAttribute('type', 'number');
  fireEvent.change(repeatEachInput, { target: { value: '3.7' } });
  await waitFor(() => expect(repeatEachInput.value).toBe('3'));
});

test('rejects decimal repeat values', async () => {
  const onClose = jest.fn();

  const Wrapper = (): React.ReactElement => {
    const { setRepeatOptions } = useAudio();
    useEffect(() => {
      setRepeatOptions((prev) => ({ ...prev, repeatEach: 1.5 }));
    }, [setRepeatOptions]);
    return (
      <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
    );
  };

  renderWithProviders(<Wrapper />);

  await screen.findByDisplayValue('1.5');
  await userEvent.click(screen.getByRole('button', { name: 'apply' }));
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByText('Please enter whole numbers only.')).toBeInTheDocument();
});

test('requires surah and verse when using single mode', async () => {
  const onClose = jest.fn();

  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  await userEvent.click(screen.getByRole('button', { name: 'single_verse' }));

  expect(screen.getByLabelText('surah_tab')).toBeInTheDocument();
  expect(screen.getByLabelText('verse')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'apply' }));

  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByText('Select a surah and verse to repeat.')).toBeInTheDocument();
});

test('hides play count in single mode', async () => {
  const onClose = jest.fn();
  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  await userEvent.click(screen.getByRole('button', { name: 'single_verse' }));

  expect(screen.queryByText('play_count')).not.toBeInTheDocument();
  expect(screen.getByText('repeat_each')).toBeInTheDocument();
});

test('surah mode uses surah selector without verse or range inputs', async () => {
  const onClose = jest.fn();
  renderWithProviders(
    <PlaybackOptionsModal open onClose={onClose} activeTab="repeat" setActiveTab={() => {}} />
  );

  await userEvent.click(screen.getByRole('button', { name: 'full_surah' }));

  expect(screen.getAllByText('surah_tab').length).toBeGreaterThan(0);
  expect(screen.queryByText('verse')).not.toBeInTheDocument();
  expect(screen.queryByText('start_surah')).not.toBeInTheDocument();
  expect(screen.queryByText('start_verse')).not.toBeInTheDocument();
  expect(screen.queryByText('end_surah')).not.toBeInTheDocument();
  expect(screen.queryByText('end_verse')).not.toBeInTheDocument();
  expect(screen.getByText('play_count')).toBeInTheDocument();
});
