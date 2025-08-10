import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioSettingsModal from '@/app/features/player/components/AudioSettingsModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockSetRepeatOptions = jest.fn();
const mockSetReciter = jest.fn();

jest.mock('@/app/features/player/context/AudioContext', () => ({
  useAudio: () => ({
    repeatOptions: { mode: 'single', start: 1, end: 1, playCount: 1, repeatEach: 1, delay: 0 },
    setRepeatOptions: mockSetRepeatOptions,
    reciter: { id: 1, name: 'Reciter 1' },
    setReciter: mockSetReciter,
  }),
}));

describe('AudioSettingsModal', () => {
  it('renders when open and handles close', async () => {
    const onClose = jest.fn();
    render(<AudioSettingsModal isOpen={true} onClose={onClose} />);
    const closeButton = screen.getByLabelText('close');
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    const { container } = render(<AudioSettingsModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
