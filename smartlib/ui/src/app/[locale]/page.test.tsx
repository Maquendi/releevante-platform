import { render, screen } from "@testing-library/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { expect, test } from "vitest";
import Home from "./page";

function renderWithIntl(locale: string, messages: AbstractIntlMessages) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Home />
    </NextIntlClientProvider>
  );
}

test("renders Home component with translations in English", () => {
  const messagesEn = {
    HomePage: {
      title: "Welcome to the Home Page",
    },
  };

  renderWithIntl("en", messagesEn);

  expect(screen.getByText("Welcome to the Home Page")).toBeInTheDocument();
});

test("renders Home component with translations in French", () => {
  const messagesFr = {
    HomePage: {
      title: "Bienvenue sur la page d'accueil",
    },
  };

  renderWithIntl("fr", messagesFr);

  expect(screen.getByText("Bienvenue sur la page d'accueil")).toBeInTheDocument();
});


test("renders Home component with translations in spanish", () => {
  const messagesEs = {
    HomePage: {
      title: "Bienvenido a la libreria inteligente",
    },
  };

  renderWithIntl("es", messagesEs);

  expect(screen.getByText("Bienvenido a la libreria inteligente")).toBeInTheDocument();
});
