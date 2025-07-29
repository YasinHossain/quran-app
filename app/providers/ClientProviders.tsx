'use client';
import React from 'react';
import { ThemeProvider, Theme } from '../context/ThemeContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SidebarProvider } from '../context/SidebarContext';

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
