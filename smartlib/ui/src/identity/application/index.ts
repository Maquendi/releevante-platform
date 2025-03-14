import { DefaultUserRepositoryImpl } from "../infrastructure/repositories-impl";
import { UserServiceFacadeImpl, DefaultUserServiceImpl } from "./services.impl";

const defaultUserService = new DefaultUserServiceImpl(
  new DefaultUserRepositoryImpl()
);

export const userServiceFacade = new UserServiceFacadeImpl(
  defaultUserService
);
