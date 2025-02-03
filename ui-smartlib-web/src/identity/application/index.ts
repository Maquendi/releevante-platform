import { DefaultAppHttpClient } from "@/lib/http/default-app-http-client";
import { DefaultUserRepositoryImpl } from "../infrastructure/repositories-impl";
import { UserServiceFacadeImpl, DefaultUserServiceImpl } from "./services.impl";
import { UserServiceApiClientImpl } from "../infrastructure/user-service-api.client";

const userServiceApiClient = new UserServiceApiClientImpl(
  new DefaultAppHttpClient()
);

const defaultUserService = new DefaultUserServiceImpl(
  new DefaultUserRepositoryImpl()
);

export const userServiceFacade = new UserServiceFacadeImpl(
  defaultUserService,
  userServiceApiClient
);
