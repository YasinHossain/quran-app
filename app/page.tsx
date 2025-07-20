// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/features/surah/1');
}