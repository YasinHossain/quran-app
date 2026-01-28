import { HomePage } from './components/HomePage';

// This page reads user preferences (theme + UI language) from cookies in `app/layout.tsx`.
// Marking it as static would cause the server HTML to always render with defaults (English + light),
// resulting in a visible flash on refresh.

export default async function Page(): Promise<React.JSX.Element> {
  return <HomePage />;
}
