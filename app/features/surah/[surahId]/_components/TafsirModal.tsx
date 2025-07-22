'use client';
import { FaArrowLeft } from '@/app/components/common/SvgIcons';
import { getTafsirByVerse } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

interface TafsirModalProps {
  verseKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirModal = ({ verseKey, isOpen, onClose }: TafsirModalProps) => {
  const { t } = useTranslation();
  const { data, error } = useSWR(
    isOpen ? ['tafsir', verseKey] : null,
    () => getTafsirByVerse(verseKey)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-[var(--background)] text-[var(--foreground)] relative max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute left-3 top-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FaArrowLeft size={18} />
        </button>
        {(!data && !error) ? (
          <div className="text-center text-teal-600">{t('loading')}</div>
        ) : error ? (
          <div className="text-center text-red-600">{t('error_loading_tafsir') || 'Error loading tafsir.'}</div>
        ) : (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data || '' }} />
        )}
      </div>
    </div>
  );
};
