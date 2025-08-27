'use client';
import React from 'react';
import { ThemeProvider, Theme } from './ThemeContext';
import { SettingsProvider } from './SettingsContext';
import { BookmarkProvider } from './BookmarkContext';
import { SidebarProvider } from './SidebarContext';
import { UIStateProvider } from './UIStateContext';
import { NavigationProvider } from './NavigationContext';

/**
 * Groups client-side providers including `ThemeProvider`, `SettingsProvider`,
 * and `SidebarProvider`. Wrap your component tree with this provider to give
 * descendants access to theme, settings, and sidebar contexts.
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
