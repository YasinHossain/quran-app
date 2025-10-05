import { renderHook, act } from '@testing-library/react';

import { useSettingsSections } from '@/app/(features)/surah/hooks/useSettingsSections';
import { logger } from '@/src/infrastructure/monitoring/Logger';

describe('useSettingsSections logging', () => {
  const originalEnv = process.env['NODE_ENV'];
  const setNodeEnv = (value: string): void => {
    (process.env as Record<string, string | undefined>)['NODE_ENV'] = value;
  };

  beforeEach(() => {
    setNodeEnv('development');
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    (logger.debug as jest.Mock).mockRestore();
    setNodeEnv(originalEnv ?? 'test');
  });

  it('logs section toggle in development', () => {
    const { result } = renderHook(() => useSettingsSections());

    act(() => result.current.handleSectionToggle('translation'));

    expect(logger.debug).toHaveBeenCalledWith('Toggling section', {
      sectionId: 'translation',
      openSections: ['translation', 'font'],
    });
  });
});
