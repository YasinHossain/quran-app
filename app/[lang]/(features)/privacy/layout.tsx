import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    `Privacy Policy for ${SITE_NAME}. Learn how we handle your data and protect your privacy while using the app.`,
  alternates: {
    canonical: absoluteUrl('/privacy'),
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}
