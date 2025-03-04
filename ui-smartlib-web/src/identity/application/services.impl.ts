import { UserRepository } from "../domain/repositories";
import { AuthCredential, UserAuthentication, UserDto } from "./dto";
import { signToken } from "@/lib/jwt-parser";
import { UserServiceFacade, UserServices } from "./services.definitions";
import { User } from "../domain/models";
import { createHashFromString } from "@/lib/utils";

export class DefaultUserServiceImpl implements UserServices {
  constructor(private repository: UserRepository) {}

  register(userDto: UserDto): Promise<User> {
    throw new Error("Method not implemented." + userDto.hash);
  }

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    console.log("login in with credential plain: " + credential.value);

    let secret = credential.value;

    const isPinSecret = secret.length == 4;

    if (isPinSecret) {
      secret = await createHashFromString(credential.value);
    }

    console.log("login in with secret: " + secret);

    const user = await this.repository.findBy(secret, !isPinSecret);

    if (!user?.data?.id) throw new Error("User not found");
    console.log(user);
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
  constructor(private defaultUserService: UserServices) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    return this.defaultUserService.authenticate(credential);
  }
}
