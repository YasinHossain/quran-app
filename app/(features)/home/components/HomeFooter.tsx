'use client';

import Link from 'next/link';
import { memo } from 'react';

/**
 * Footer component for the home page.
 * Displays beta notice and legal links (Privacy Policy, Terms of Use).
 */
export const HomeFooter = memo(function HomeFooter() {
  return (
    <footer className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 pb-20 md:pb-4">
      <div className="border-t border-border pt-3">
        {/* Beta Notice */}
        <p className="text-center text-sm text-muted mb-3">
          This application is currently in <span className="font-medium text-accent">beta</span>.
          Some features may be incomplete or subject to change. We appreciate your feedback as we
          continue to improve.
        </p>

        {/* Legal Links */}
        <div className="flex justify-center items-center gap-4 text-sm text-muted">
          <Link href="/privacy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <span className="text-border">•</span>
          <Link href="/terms" className="hover:text-accent transition-colors">
            Terms of Use
          </Link>
        </div>

        {/* Attribution */}
        <p className="text-center text-xs text-muted/70 mt-3">
          Quranic content provided by{' '}
          <a
            href="https://quran.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors underline"
          >
            Quran Foundation
          </a>
        </p>
      </div>
    </footer>
  );
});
