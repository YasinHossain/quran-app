// app/surah/[surahId]/layout.tsx
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/context/AudioContext';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AudioProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex flex-grow overflow-hidden">
            <IconSidebar />
            <SurahListSidebar />
            {children}
          </div>
        </div>
      </AudioProvider>
    </SettingsProvider>
  );
}