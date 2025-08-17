'use client';
import { ChevronDownIcon } from '@/app/shared/icons';
import Spinner from '@/app/shared/Spinner';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';
import { useSettings } from '@/app/providers/SettingsContext';
import { useTafsirPanels } from '../hooks/useTafsirPanels';

interface TafsirPanelsProps {
  verseKey: string;
  tafsirIds: number[];
}

export const TafsirPanels = ({ verseKey, tafsirIds }: TafsirPanelsProps) => {
  const { settings } = useSettings();
  const { openPanels, tafsirTexts, loading, togglePanel } = useTafsirPanels(verseKey);

  return (
    <>
      {tafsirIds.map((id) => {
        const open = !!openPanels[id];
        return (
          <div key={id} className="border-b border-[var(--border-color)] last:border-none">
            <button
              onClick={() => togglePanel(id)}
              className="w-full flex items-center justify-between py-3 text-left"
            >
              <span className="font-semibold text-primary">Tafsir {id}</span>
              <ChevronDownIcon
                size={16}
                className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="bg-teal-50  rounded-md p-4 max-h-64 overflow-y-auto">
                  {loading[id] ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="h-5 w-5 text-teal-600" />
                    </div>
                  ) : (
                    <div
                      className="prose max-w-none text-primary whitespace-pre-wrap"
                      style={{ fontSize: `${settings.tafsirFontSize}px` }}
                      dangerouslySetInnerHTML={{
                        __html: applyArabicFont(tafsirTexts[id] || '', settings.arabicFontFace),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
