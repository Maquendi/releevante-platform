"use client";

import React from "react";
import {
  QueryClientProvider,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { AppReduxProvider } from "@/redux/provider";

interface ReactQueryProviderProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({
  children,
  messages,
  locale,
}: ReactQueryProviderProps) {
  const [client] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 10 * 60 * 1000,
        },
        dehydrate: {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        timeZone="America/Santo_Domingo"
      >
        <AppReduxProvider>{children}</AppReduxProvider>
      </NextIntlClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
