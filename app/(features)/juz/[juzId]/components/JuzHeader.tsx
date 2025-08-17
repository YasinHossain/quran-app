import { useTranslation } from 'react-i18next';
import type { Juz } from '@/types';

interface JuzHeaderProps {
  juz?: Juz;
}

export function JuzHeader({ juz }: JuzHeaderProps) {
  const { t } = useTranslation();
  if (!juz) return null;
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-primary">
        {t('juz_number', { number: juz.juz_number })}
      </h1>
    </div>
  );
}

export default JuzHeader;
