'use client';

import React from 'react';

import { BookmarkIcon, CheckIcon } from '@/app/shared/icons';

// Illustration component for EmptyBookmarks
export const BookmarkIllustration = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative mb-8">
      <div
        className={`mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 shadow-lg transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <BookmarkIcon size={48} className="text-accent" />
      </div>

      {/* Floating elements */}
      <div
        className={`absolute -top-2 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        <CheckIcon size={16} className="text-accent" />
      </div>
      <div
        className={`absolute -bottom-2 -left-4 h-6 w-6 rounded-full bg-accent/20 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        style={{ transitionDelay: '600ms' }}
      />
    </div>
  );
};

// Main content for EmptyBookmarks
export const EmptyBookmarksContent = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: '300ms' }}
    >
      <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
        Start Your Spiritual Journey
      </h2>
      <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-muted">
        Save your favorite Quran verses. Build a personal collection for study, reflection, and
        memorization.
      </p>
    </div>
  );
};

// Removed PrimaryAction component - no create folder functionality

// Guide step component
interface GuideStepProps {
  step: number;
  title: string;
  description: string;
}

const GuideStep = ({ step, title, description }: GuideStepProps): React.JSX.Element => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
      <span className="text-accent text-lg font-bold">{step}</span>
    </div>
    <div className="font-semibold text-foreground mb-2">{title}</div>
    <p className="text-sm text-muted leading-relaxed">{description}</p>
  </div>
);

// Quick start guide section
export const QuickStartGuide = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-8 shadow-sm transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: '700ms' }}
    >
      <div className="mb-6 flex items-center justify-center gap-2">
        <CheckIcon size={20} className="text-accent" />
        <h3 className="text-lg font-bold text-foreground">Quick Start Guide</h3>
      </div>

      <div className="grid gap-6 text-left md:grid-cols-3">
        <GuideStep
          step={1}
          title="Save Verses"
          description="Bookmark verses while reading by tapping the bookmark icon"
        />
        <GuideStep
          step={2}
          title="Organize"
          description="Your bookmarked verses are automatically organized for easy access"
        />
        <GuideStep
          step={3}
          title="Quick Access"
          description="Find your saved verses anytime in this bookmarks section"
        />
      </div>
    </div>
  );
};
