'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconMoon, IconSun, IconSettings } from '@tabler/icons-react';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { usePathname } from 'next/navigation';

const GlobalSettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // On Surah routes, the page already renders a Settings sidebar.
  // Avoid rendering this global modal there to prevent double overlays on mobile.
  const isSurahRoute = pathname?.startsWith('/surah');

  if (isSurahRoute) return null;

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Settings Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <IconSettings size={24} className="text-accent" />
                  <h2 className="text-xl font-bold text-foreground">Settings</h2>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  aria-label="Close settings"
                >
                  <IconX size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90dvh-80px)]">
                <div className="space-y-6">
                  {/* Theme Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Appearance</h3>

                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                          <IconMoon size={20} className="text-blue-500" />
                        ) : (
                          <IconSun size={20} className="text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">Theme</p>
                          <p className="text-sm text-muted-foreground">
                            Currently using {theme === 'dark' ? 'dark' : 'light'} mode
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
                      >
                        Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                      </button>
                    </div>
                  </div>

                  {/* App Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>

                    <div className="p-4 bg-muted/20 rounded-xl">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">App Name</span>
                          <span className="text-foreground font-medium">Quran Mazid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Version</span>
                          <span className="text-foreground font-medium">v1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform</span>
                          <span className="text-foreground font-medium">Web App</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Future Settings Placeholder */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Reading Preferences
                    </h3>

                    <div className="p-4 bg-muted/20 rounded-xl">
                      <p className="text-muted-foreground text-center py-8">
                        Reading settings will be available here soon.
                        <br />
                        Stay tuned for font size, translation preferences, and more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border/30 bg-muted/10">
                <div className="flex justify-end">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalSettingsModal;
