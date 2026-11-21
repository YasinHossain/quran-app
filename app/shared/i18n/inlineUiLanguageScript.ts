import { ENABLED_LANGUAGE_CODES, RTL_LANGUAGE_CODES } from './languageRegistry';
import { UI_LANGUAGE_STORAGE_KEY } from './uiLanguages';

/**
 * Builds the blocking `<head>` script that syncs `<html lang/dir>` and the language cookie before
 * first paint. The language comes from the URL prefix, then localStorage, then the cookie.
 * Locale and RTL lists are generated from the registry so they cannot drift from routing.
 */
export function buildInlineUiLanguageScript(
  languages: ReadonlyArray<string> = ENABLED_LANGUAGE_CODES,
  rtlLanguages: ReadonlyArray<string> = RTL_LANGUAGE_CODES
): string {
  const k = JSON.stringify(UI_LANGUAGE_STORAGE_KEY);
  const s = JSON.stringify(languages);
  const rtl = JSON.stringify(rtlLanguages);
  return `(function(){try{var k=${k};var s=${s};var rtl=${rtl};var l=null;try{var p=location&&location.pathname?location.pathname.split('/')[1]:null;if(p){p=p.toLowerCase();if(s.indexOf(p)>-1)l=p}}catch(e){}if(!l){try{l=localStorage.getItem(k)}catch(e){}}if(!l){try{var re=new RegExp('(?:^|; )'+k+'=([^;]+)');var m=document.cookie.match(re);l=m?decodeURIComponent(m[1]):null}catch(e){}}if(!l||s.indexOf(l)===-1)return;var r=document.documentElement;if(r){if(r.lang!==l)r.lang=l;try{r.dir=rtl.indexOf(l)>-1?'rtl':'ltr'}catch(e){}}try{var c=k+'='+encodeURIComponent(l)+'; path=/; max-age=31536000; SameSite=Lax';try{if(location&&location.protocol==='https:')c+='; Secure'}catch(e){}document.cookie=c}catch(e){}}catch(e){}})()`;
}
