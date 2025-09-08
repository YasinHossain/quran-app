import { useJuzContentProps } from './useJuzContentProps';
import { useJuzData } from './useJuzData';
import { useJuzPlayerBarProps } from './useJuzPlayerBarProps';
import { useJuzSettingsProps } from './useJuzSettingsProps';

interface UseJuzClientStateReturn {
  isHidden: boolean;
  contentProps: ReturnType<typeof useJuzContentProps>;
  settingsProps: ReturnType<typeof useJuzSettingsProps>;
  playerBarProps: ReturnType<typeof useJuzPlayerBarProps>['playerBarProps'];
}

function useJuzProps(
  juzId: string,
  t: (key: string) => string,
  juzData: ReturnType<typeof useJuzData>
): UseJuzClientStateReturn {
  const contentProps = useJuzContentProps({ juzId, t, ...juzData });
  const settingsProps = useJuzSettingsProps({ t, ...juzData });
  const { isHidden, playerBarProps } = useJuzPlayerBarProps(juzData);
  return { isHidden, contentProps, settingsProps, playerBarProps };
}

export function useJuzClientState(
  juzId: string,
  t: (key: string) => string
): UseJuzClientStateReturn {
  const juzData = useJuzData(juzId);
  return useJuzProps(juzId, t, juzData);
}
