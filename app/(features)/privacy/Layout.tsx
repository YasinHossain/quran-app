import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Al Quran',
  description:
    'Privacy Policy for the Quran App. Learn how we handle your data and protect your privacy while using our Quranic reading and study application.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}
