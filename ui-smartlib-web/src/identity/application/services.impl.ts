import { UserRepository } from "../domain/repositories";
import { AuthCredential, UserAuthentication, UserDto } from "./dto";
import { signToken } from "@/lib/jwt-parser";
import {
  UserServiceApiClient,
  UserServiceFacade,
  UserServices,
} from "./services.definitions";
import { User } from "../domain/models";
import { createHashFromString } from "@/lib/utils";

export class DefaultUserServiceImpl implements UserServices {
  constructor(private repository: UserRepository) {}

  register(userDto: UserDto): Promise<User> {
    throw new Error("Method not implemented." + userDto.hash);
  }

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    const hashedCredential = await createHashFromString(credential.value);
    const user = await this.repository.findBy(hashedCredential);
    if(!user?.data?.id) throw new Error("User not found")
    console.log(user)
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
      console.log('err auth server',error)
      const response = await this.userServiceApiClient.authenticate(credential);
      await this.defaultUserService.register(response?.user);
      return response;
    }
  }
}
