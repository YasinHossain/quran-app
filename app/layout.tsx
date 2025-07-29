// app/layout.tsx
import './globals.css';
import './fonts.css';
import TranslationProvider from './providers/TranslationProvider';
import ClientProviders from './providers/ClientProviders';
import localFont from 'next/font/local';
import { Inter, Noto_Sans_Arabic, Noto_Sans_Bengali } from 'next/font/google';
import { cookies } from 'next/headers';

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

const arabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
});

const bengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
});

export const metadata = {
  title: 'Quran Mazid',
  description: 'Read, Study, and Learn The Holy Quran',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const stored = cookieStore.get('theme');
  const theme =
    stored && (stored.value === 'light' || stored.value === 'dark')
      ? (stored.value as 'light' | 'dark')
      : 'light';

  return (
    <html lang="en" data-theme={theme} className={theme === 'dark' ? 'dark' : undefined}>
      <body
        className={`font-sans ${kfgqpc.variable} ${nastaliq.variable} ${amiri.variable} ${arabic.variable} ${bengali.variable} ${inter.className}`}
      >
        <TranslationProvider>
          <ClientProviders initialTheme={theme}>{children}</ClientProviders>
        </TranslationProvider>
      </body>
    </html>
  );
}
