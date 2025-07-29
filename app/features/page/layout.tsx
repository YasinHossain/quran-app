// app/features/page/layout.tsx
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { AudioProvider } from '@/app/context/AudioContext';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <Header />
      <div className="h-screen flex flex-col pt-16">
        <div className="flex flex-grow overflow-hidden">
          <IconSidebar />
          <SurahListSidebar />
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
