import { hashString } from "@/lib/hash-utils";
import { UserRepository } from "../domain/repositories";
import { AuthCredential, UserAuthentication } from "./dto";
import { signToken } from "@/lib/jwt-parser";
import { UserServiceApiClient, UserServices } from "./services.definitions";

export class DefaultUserServiceImpl implements UserServices {
  constructor(private repository: UserRepository) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    var hashedCredential = hashString(credential.value);
    const user = await this.repository.findBy(hashedCredential);
    const jwtToken = signToken({
      sub: user.data.id,
      org: user.data.org,
    });
    return {
      token: jwtToken,
      user: {
        ...user.data,
      },
    };
  }
}

export class UserServiceFacade implements UserServices {
  constructor(
    private defaultUserService: UserServices,
    private userServiceApiClient: UserServiceApiClient
  ) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    try {
      return this.defaultUserService.authenticate(credential);
    } catch (error) {
      return this.userServiceApiClient.authenticate(credential);
    }
  }
}
