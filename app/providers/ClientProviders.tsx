'use client';
import React from 'react';
import { ThemeProvider, Theme } from './ThemeContext';
import { SettingsProvider } from './SettingsContext';
import { BookmarkProvider } from './BookmarkContext';
import { UIStateProvider } from './UIStateContext';
import { SidebarProvider } from './SidebarContext';
import { NavigationProvider } from './NavigationContext';

/**
 * TESTING: ALL PROVIDERS ENABLED
 */
export default function ClientProviders({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <SettingsProvider>
        <BookmarkProvider>
          <UIStateProvider>
            <SidebarProvider>
              <NavigationProvider>{children}</NavigationProvider>
            </SidebarProvider>
          </UIStateProvider>
        </BookmarkProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
