import { redirect } from 'next/navigation';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { getPageUiLanguage } from '@/app/shared/i18n/serverLocale';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';

export default async function TafsirSurahRedirect({
  params,
}: {
  params: Promise<{ lang: string; surahId: string }>;
}): Promise<never> {
  const { surahId } = await params;
  const locale = await getPageUiLanguage(params);
  redirect(localizeHref(buildTafsirRoute(surahId, 1), locale));
}
