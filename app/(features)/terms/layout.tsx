import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | Al Quran',
    description:
        'Terms of Use for the Quran App. Review the terms and conditions governing your use of our Quranic reading and study application.',
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    return <>{children}</>;
}
