import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
export type Locales = 'en' | 'fr' | 'es'

export default getRequestConfig(async ({locale}) => {
  if (!routing.locales.includes(locale as Locales)) notFound();
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "America/Santo_Domingo"
  };
});