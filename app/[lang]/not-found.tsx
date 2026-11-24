import type { Metadata } from 'next';

import { SITE_NAME } from '@/lib/seo/site';

import { NotFoundClient } from './NotFoundClient';

export const metadata: Metadata = {
  title: {
    absolute: `Page not found – ${SITE_NAME}`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound(): React.JSX.Element {
  return <NotFoundClient />;
}

