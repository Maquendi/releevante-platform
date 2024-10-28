import { hashString } from "@/lib/hash-utils";
import { UserRepository } from "../domain/repositories";
import { AuthCredential, UserAuthentication } from "./dto";
import { signToken } from "@/lib/jwt-parser";
import { DefaultUserRepositoryImpl } from "../infrastructure/repositories-impl";
import { UserServices } from "./services";

class DefaultUserServiceImpl implements UserServices {
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

export const defaultUserService = new DefaultUserServiceImpl(
  new DefaultUserRepositoryImpl()
);
