import { useJuzContentProps } from './useJuzContentProps';
import { useJuzPlayerBarProps } from './useJuzPlayerBarProps';
import { useJuzSettingsProps } from './useJuzSettingsProps';
import { useJuzData } from './useJuzData';

export function useJuzClientState(juzId: string, t: (key: string) => string) {
  const juzData = useJuzData(juzId);

  const contentProps = useJuzContentProps({ juzId, t, ...juzData });
  const settingsProps = useJuzSettingsProps({ t, ...juzData });
  const { isHidden, playerBarProps } = useJuzPlayerBarProps(juzData);

  return { isHidden, contentProps, settingsProps, playerBarProps } as const;
}
