import SurahListSidebar from './common/SurahListSidebar';
import { getChapters } from '@/lib/api';

export default async function SurahListSidebarServer() {
  const chapters = await getChapters().catch(() => []);
  return <SurahListSidebar initialChapters={chapters} />;
}
