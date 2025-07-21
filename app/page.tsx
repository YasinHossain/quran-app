import HomePage from './components/HomePage';
import { getChapters } from '@/lib/api';

export default async function Page() {
  const chapters = await getChapters().catch(() => []);
  return <HomePage chapters={chapters} />;
}
