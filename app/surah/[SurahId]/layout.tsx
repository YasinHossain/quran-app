// app/surah/[surahId]/layout.tsx
import Header from '@/app/components/Header';
import IconSidebar from '@/app/components/IconSidebar';
import SurahListSidebar from '@/app/components/SurahListSidebar';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <IconSidebar />
        <SurahListSidebar />
        {children}
      </div>
    </div>
  );
}