import { defaultCartRepository } from "../infrastructure/cart-repository-impl";
import { DefaultCartService } from "./cart-service.impl";
import { CartServiceFacade } from "./cart-service-facade-impl";
import { DefaultBookTransactionService } from "./book-transaction-service.impl";
import { defaultBookLoanRepositoryImpl } from "../infrastructure/book-loan-repository.impl";
import { bookServiceFacade } from "@/book/application";
import { SettingsFacade } from "./settings.facade";
import { defaultSettingsRepository } from "../infrastructure/settings-repository.impl";
import { ServiceRatingFacade } from "./service.rating.facade";
import { defaultServiceRepository } from "../infrastructure/service-repository.impl";
import { ServiceRatingService } from "./service.rating-service-impl";
import { DefaultBookTransactionServiceFacade } from "./book-transaction-service-facade.impl";

const defaultCartService = new DefaultCartService(defaultCartRepository);

export const settingsFacade = new SettingsFacade(defaultSettingsRepository);
const bookLoanService = new DefaultBookTransactionService(
  defaultBookLoanRepositoryImpl,
  bookServiceFacade,
  settingsFacade
);

const serviceRatingServic = new ServiceRatingService(defaultServiceRepository);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartService,
  bookLoanService
);

export const bookTransactionServiceFacade =
  new DefaultBookTransactionServiceFacade(bookLoanService);

export const serviceRatingFacade = new ServiceRatingFacade(serviceRatingServic);
