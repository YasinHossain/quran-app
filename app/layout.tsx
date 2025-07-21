// app/layout.tsx
import './globals.css';
import './fonts.css';
import TranslationProvider from './providers/TranslationProvider';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // Import SettingsProvider
import { SidebarProvider } from './context/SidebarContext'; // Import SidebarProvider
import localFont from 'next/font/local';

const kfgqpc = localFont({
  src: '../public/fonts/KFGQPC-Uthman-Taha.ttf',
  variable: '--font-kfgqpc',
  display: 'swap',
});

const nastaliq = localFont({
  src: '../public/fonts/Noto Nastaliq Urdu.ttf',
  variable: '--font-nastaliq',
  display: 'swap',
});

const amiri = localFont({
  src: '../public/fonts/Amiri.ttf',
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
      <body className={`font-sans ${kfgqpc.variable} ${nastaliq.variable} ${amiri.variable}`}>
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
