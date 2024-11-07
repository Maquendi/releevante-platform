import { CoreApiClientImpl } from "../infrastructure/backend-api-client";
import { DefaultBridgeIoApiClient } from "../infrastructure/brigde-io-client";
import { defaultCartRepository } from "../infrastructure/cart-repository-impl";
import { DefaultCartService } from "./cart-service.impl";
import { CartServiceFacade } from "./facade";
import { BookLoanServiceImpl } from "./loan-service.impl";
import { defaultBookLoanRepositoryImpl } from "../infrastructure/book-loan-repository.impl";
import { defaultBookServiceFacade } from "@/book/application";

const bridgeIoApiClient = new DefaultBridgeIoApiClient();
const coreApiClient = new CoreApiClientImpl();

const defaultCartService = new DefaultCartService(
  defaultBookServiceFacade,
  defaultCartRepository
);

const bookLoanService = new BookLoanServiceImpl(
  defaultBookLoanRepositoryImpl,
  defaultBookServiceFacade,
  coreApiClient,
  bridgeIoApiClient
);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartService,
  bookLoanService
);
