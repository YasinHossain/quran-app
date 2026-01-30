import { redirect } from 'next/navigation';

import { buildTafsirRoute } from '@/app/shared/navigation/routes';

export default async function TafsirSurahRedirect({
  params,
}: {
  params: Promise<{ surahId: string }>;
}): Promise<never> {
  const { surahId } = await params;
  redirect(buildTafsirRoute(surahId, 1));
}

