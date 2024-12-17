import "../globals.css";
import { getMessages } from "next-intl/server";
import { Providers } from "./Providers";
import { Roboto } from "next/font/google";
import SocketIoClient from "@/components/socket/socket-client";

const roboto = Roboto({
  weight: ["100","300","400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});


export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <Providers messages={messages} locale={locale}>
        <SocketIoClient></SocketIoClient>
        {/* <WebSocketConnection></WebSocketConnection> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
