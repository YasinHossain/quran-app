// app/layout.tsx
import './globals.css';
import TranslationProvider from './providers/TranslationProvider';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext'; // Import SettingsProvider
import { SidebarProvider } from './context/SidebarContext'; // Import SidebarProvider

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
      <body className="font-sans">
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