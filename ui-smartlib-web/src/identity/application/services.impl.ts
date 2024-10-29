import { hashString } from "@/lib/hash-utils";
import { UserRepository } from "../domain/repositories";
import { AuthCredential, UserAuthentication, UserDto } from "./dto";
import { signToken } from "@/lib/jwt-parser";
import {
  UserServiceApiClient,
  UserServiceFacade,
  UserServices,
} from "./services.definitions";
import { User } from "../domain/models";

export class DefaultUserServiceImpl implements UserServices {
  constructor(private repository: UserRepository) {}

  register(userDto: UserDto): Promise<User> {
    throw new Error("Method not implemented.");
  }

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

export class UserServiceFacadeImpl implements UserServiceFacade {
  constructor(
    private defaultUserService: UserServices,
    private userServiceApiClient: UserServiceApiClient
  ) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    try {
      return this.defaultUserService.authenticate(credential);
    } catch (error) {
      const response = await this.userServiceApiClient.authenticate(credential);
      await this.defaultUserService.register(response?.user);
      return response;
    }
  }
}
