'use client';

import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Footer component for the home page.
 * Displays beta notice and legal links (Privacy Policy, Terms of Use).
 */
export const HomeFooter = memo(function HomeFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 pb-20 md:pb-4">
      <div className="border-t border-border pt-3">
        {/* Beta Notice */}
        <p className="text-center text-sm text-muted mb-3">{t('home_footer_beta_notice')}</p>

        {/* Legal Links */}
        <div className="flex justify-center items-center gap-4 text-sm text-muted">
          <Link href="/privacy" className="hover:text-accent transition-colors">
            {t('home_footer_privacy_policy')}
          </Link>
          <span className="text-border">•</span>
          <Link href="/terms" className="hover:text-accent transition-colors">
            {t('home_footer_terms_of_use')}
          </Link>
        </div>

        {/* Attribution */}
        <p className="text-center text-xs text-muted/70 mt-3">
          {t('home_footer_attribution_prefix')}{' '}
          <a
            href="https://quran.foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors underline"
          >
            {t('home_footer_attribution_source')}
          </a>
        </p>
      </div>
    </footer>
  );
});
