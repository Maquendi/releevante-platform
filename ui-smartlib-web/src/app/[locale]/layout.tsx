import "../globals.css";
import {getMessages} from 'next-intl/server';
import { Providers } from "./Providers";
 
export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
 
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
        
      </body>
    </html>
  );
}