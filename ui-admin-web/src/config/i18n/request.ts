import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
type Locales = 'en' | 'fr' | 'es'

export default getRequestConfig(async ({requestLocale}) => {
  let locale= await requestLocale
  if (!routing.locales.includes(locale as Locales)) notFound();

  if (!locale || !routing.locales.includes(locale as any)) {
       locale = routing.defaultLocale;
     }
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "America/Santo_Domingo"
  };
});