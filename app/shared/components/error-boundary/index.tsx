// Export all error boundary components
export { ErrorBoundary, DefaultErrorFallback, useErrorHandler } from './ErrorBoundary';
export { FeatureErrorBoundary, withFeatureErrorBoundary } from './FeatureErrorBoundary';

// Pre-configured feature error boundaries for common features
import React from 'react';

import { FeatureErrorBoundary } from './FeatureErrorBoundary';

interface FeatureErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

/**
 * Audio player error boundary
 */
export function AudioPlayerErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Audio Player"
      description="There was an issue with the audio player. You can still read the Quran text."
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Surah reading error boundary
 */
export function SurahErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Surah Reader"
      description="There was an issue loading this surah. Please try refreshing the page."
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Bookmarks error boundary
 */
export function BookmarksErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Bookmarks"
      description="There was an issue with your bookmarks. Your saved verses are safe."
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Search error boundary
 */
export function SearchErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Search"
      description="There was an issue with search functionality. Please try again."
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Tafsir error boundary
 */
export function TafsirErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Tafsir"
      description="There was an issue loading the commentary. The verse text is still available."
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * Navigation error boundary
 */
export function NavigationErrorBoundary({
  children,
}: FeatureErrorBoundaryWrapperProps): React.JSX.Element {
  return (
    <FeatureErrorBoundary
      featureName="Navigation"
      description="There was an issue with navigation. Please refresh the page."
    >
      {children}
    </FeatureErrorBoundary>
  );
}
