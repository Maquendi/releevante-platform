import { render, screen } from "@testing-library/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { expect, test } from "vitest";
import Home from "./page";

// reusable Helper to render different locales and messages
function renderWithIntl(locale: string, messages: AbstractIntlMessages) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Home />
    </NextIntlClientProvider>
  );
}

// Test to check if the English JSON renders correctly
test("renders Home component with translations in English", () => {
  const messagesEn = {
    HomePage: {
      title: "Welcome to the Home Page",
    },
  };

  renderWithIntl("en", messagesEn);

  expect(screen.getByText("Welcome to the Home Page")).toBeInTheDocument();
});

// Test to check if the Frances JSON renders correctly
test("renders Home component with translations in French", () => {
  const messagesFr = {
    HomePage: {
      title: "Bienvenue sur la page d'accueil",
    },
  };

  renderWithIntl("fr", messagesFr);

  expect(screen.getByText("Bienvenue sur la page d'accueil")).toBeInTheDocument();
});


// Test to check if the spanish JSON renders correctly
test("renders Home component with translations in spanish", () => {
  const messagesEs = {
    HomePage: {
      title: "Bienvenido a la libreria inteligente",
    },
  };

  renderWithIntl("es", messagesEs);

  expect(screen.getByText("Bienvenido a la libreria inteligente")).toBeInTheDocument();
});
