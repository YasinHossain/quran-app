import { useJuzContentProps } from './useJuzContentProps';
import { useJuzPlayerBarProps } from './useJuzPlayerBarProps';
import { useJuzSettingsProps } from './useJuzSettingsProps';
import { useJuzData } from './useJuzData';

interface UseJuzClientStateReturn {
  isHidden: boolean;
  contentProps: ReturnType<typeof useJuzContentProps>;
  settingsProps: ReturnType<typeof useJuzSettingsProps>;
  playerBarProps: ReturnType<typeof useJuzPlayerBarProps>['playerBarProps'];
}

export function useJuzClientState(
  juzId: string,
  t: (key: string) => string
): UseJuzClientStateReturn {
  const juzData = useJuzData(juzId);

  const contentProps = useJuzContentProps({ juzId, t, ...juzData });
  const settingsProps = useJuzSettingsProps({ t, ...juzData });
  const { isHidden, playerBarProps } = useJuzPlayerBarProps(juzData);

  return { isHidden, contentProps, settingsProps, playerBarProps };
}
