import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    `Terms of Use for ${SITE_NAME}. Review the terms and conditions governing your use of the app.`,
  alternates: {
    canonical: absoluteUrl('/terms'),
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}
