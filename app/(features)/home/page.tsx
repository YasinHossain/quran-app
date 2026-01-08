import { HomePage } from './components/HomePage';

// Static generation - pre-renders at build time for instant TTFB
export const dynamic = 'force-static';
export const revalidate = false;

export default function Page(): React.JSX.Element {
  return <HomePage />;
}
