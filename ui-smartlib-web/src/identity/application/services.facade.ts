import { AuthCredential, UserAuthentication } from "./dto";
import { UserServices } from "./services";
import { defaultUserService } from "./services.default";
import { userServiceGateway, UserServiceGateway } from "./services.gateway";

class UserServiceFacade implements UserServices {
  constructor(
    private defaultUserService: UserServices,
    private userServiceGateway: UserServiceGateway
  ) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    try {
      return this.defaultUserService.authenticate(credential);
    } catch (error) {
      return this.userServiceGateway.authenticate(credential);
    }
  }
}

export const userServiceFacade = new UserServiceFacade(
  defaultUserService,
  userServiceGateway
);
