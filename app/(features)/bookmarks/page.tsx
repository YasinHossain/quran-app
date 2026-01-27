import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { isUiLanguageCode, type UiLanguageCode } from '@/app/shared/i18n/uiLanguages';

export default async function BookmarksRootRedirect(): Promise<never> {
  const rawLocale = (await headers()).get('x-ui-language');
  const locale: UiLanguageCode = rawLocale && isUiLanguageCode(rawLocale) ? rawLocale : 'en';
  redirect(localizeHref('/bookmarks/last-read', locale));
}
