import { defaultCartRepository } from "../infrastructure/cart-repository-impl";
import { DefaultCartService } from "./cart-service.impl";
import { CartServiceFacade } from "./facade";
import { BookLoanServiceImpl } from "./loan-service.impl";
import { defaultBookLoanRepositoryImpl } from "../infrastructure/book-loan-repository.impl";
import { bookServiceFacade } from "@/book/application";
import { SettingsFacade } from "./settings.facade";
import { defaultSettingsRepository } from "../infrastructure/settings-repository.impl";

const defaultCartService = new DefaultCartService(defaultCartRepository);

const bookLoanService = new BookLoanServiceImpl(
  defaultBookLoanRepositoryImpl,
  bookServiceFacade
);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartService,
  bookLoanService
);

export const settingsFacade = new SettingsFacade(defaultSettingsRepository);
