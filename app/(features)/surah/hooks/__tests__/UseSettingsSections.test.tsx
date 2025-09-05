import { renderHook, act } from '@testing-library/react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import { useSettingsSections } from '../useSettingsSections';

describe('useSettingsSections logging', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    (logger.debug as jest.Mock).mockRestore();
    process.env.NODE_ENV = originalEnv;
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
