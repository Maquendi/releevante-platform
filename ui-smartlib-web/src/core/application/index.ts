import { defaultCartRepository } from "../infrastructure/cart-repository-impl";
import { DefaultCartService } from "./cart-service.impl";
import { CartServiceFacade } from "./cart-service-facade-impl";
import { BookLoanServiceImpl } from "./loan-service.impl";
import { defaultBookLoanRepositoryImpl } from "../infrastructure/book-loan-repository.impl";
import { bookServiceFacade } from "@/book/application";
import { SettingsFacade } from "./settings.facade";
import { defaultSettingsRepository } from "../infrastructure/settings-repository.impl";
import { ServiceRatingFacade } from "./service.rating.facade";
import { defaultServiceRepository } from "../infrastructure/service-repository.impl";
import { ServiceRatingService } from "./service.rating-service-impl";
import { LoanServiceFacade } from "./loan-service-facade.impl";


const defaultCartService = new DefaultCartService(defaultCartRepository);

const bookLoanService = new BookLoanServiceImpl(
  defaultBookLoanRepositoryImpl,
  bookServiceFacade
);

const serviceRatingServic = new ServiceRatingService(defaultServiceRepository);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartService,
  bookLoanService
);

export const loanServiceFacade = new LoanServiceFacade(bookLoanService);

export const settingsFacade = new SettingsFacade(defaultSettingsRepository);
export const serviceRatingFacade = new ServiceRatingFacade(serviceRatingServic);
