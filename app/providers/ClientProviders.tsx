'use client';
import React from 'react';
import { ThemeProvider, Theme } from '../context/ThemeContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SidebarProvider } from '../context/SidebarContext';

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
        <SidebarProvider>{children}</SidebarProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
