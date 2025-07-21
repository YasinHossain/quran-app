// app/layout.tsx
import './globals.css';
import './fonts.css';
import TranslationProvider from './providers/TranslationProvider';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // Import SettingsProvider
import { SidebarProvider } from './context/SidebarContext'; // Import SidebarProvider
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

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

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Quran Mazid',
  description: 'Read, Study, and Learn The Holy Quran',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${kfgqpc.variable} ${nastaliq.variable} ${amiri.variable} ${inter.className}`}
      >
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
