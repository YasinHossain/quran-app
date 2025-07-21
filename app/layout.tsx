// app/layout.tsx
import './globals.css';
import './fonts.css';
import TranslationProvider from './providers/TranslationProvider';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // Import SettingsProvider
import { SidebarProvider } from './context/SidebarContext'; // Import SidebarProvider
import localFont from 'next/font/local';

const kfgqpc = localFont({
  src: [
    { path: '../public/fonts/hafs.18.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/hafs.18.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-kfgqpc',
  display: 'swap',
});

const pdms = localFont({
  src: '../public/fonts/PDMS_Saleem_Quran.ttf',
  variable: '--font-pdms',
  display: 'swap',
});

const amiri = localFont({
  src: [
    { path: '../public/fonts/AmiriQuran-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/AmiriQuran-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata = {
  title: 'Quran Mazid',
  description: 'Read, Study, and Learn The Holy Quran',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans ${kfgqpc.variable} ${pdms.variable} ${amiri.variable}`}>
        <TranslationProvider>
          <ThemeProvider>
            <SettingsProvider> {/* Wrap with SettingsProvider */}
              <SidebarProvider> {/* Wrap with SidebarProvider */}
                {children}
              </SidebarProvider>
            </SettingsProvider>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
