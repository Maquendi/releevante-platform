import { defaultBookService } from "@/book/application/services-default";
import { defaultBookRepository } from "@/book/infrastructure/repositories-impl";
import { CoreApiClient } from "../infrastructure/backend-api-client";
import { DefaultBridgeIoApiClient } from "../infrastructure/brigde-io-client";
import { defaultCartRepository } from "../infrastructure/repositories-impl";
import {
  CartServiceApiClient,
  CartServiceFacade,
  DefaultCartService,
} from "./services.impl";

const coreApiClient = new CoreApiClient();
const bridgeIoApiClient = new DefaultBridgeIoApiClient();
const cartServiceApiClient = new CartServiceApiClient(
  coreApiClient,
  bridgeIoApiClient,
  defaultBookRepository
);

const defaultCartService = new DefaultCartService(
  defaultBookService,
  defaultCartRepository
);

export const cartServiceFacade = new CartServiceFacade(
  defaultCartRepository,
  defaultBookService,
  defaultCartService,
  cartServiceApiClient
);