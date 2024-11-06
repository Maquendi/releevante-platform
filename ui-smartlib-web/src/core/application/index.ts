import { defaultBookService } from "@/book/application/book-service-impl";
import { CoreApiClientImpl } from "../infrastructure/backend-api-client";
import { DefaultBridgeIoApiClient } from "../infrastructure/brigde-io-client";
import { defaultCartRepository } from "../infrastructure/cart-repository-impl";
import { DefaultCartService } from "./cart-service.impl";
import { CartServiceFacade } from "./facade";
import { BookLoanServiceImpl } from "./loan-service.impl";
import { defaultBookLoanRepositoryImpl } from "../infrastructure/book-loan-repository.impl";

const bridgeIoApiClient = new DefaultBridgeIoApiClient();
const coreApiClient = new CoreApiClientImpl();

const defaultCartService = new DefaultCartService(
  defaultBookService,
  defaultCartRepository
);

const bookLoanService = new BookLoanServiceImpl(
  defaultBookLoanRepositoryImpl,
  defaultBookService,
  coreApiClient,
  bridgeIoApiClient
);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartService,
  bookLoanService
);
