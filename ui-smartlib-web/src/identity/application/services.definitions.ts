import { User } from "../domain/models";
import { AuthCredential, UserAuthentication, UserDto } from "./dto";

export interface UserServices {
  authenticate(credential: AuthCredential): Promise<UserAuthentication>;
  register(userDto: UserDto): Promise<User>;
}

export interface UserServiceApiClient {
  authenticate(credential: AuthCredential): Promise<UserAuthentication>;
}

export interface UserServiceFacade {
  authenticate(credential: AuthCredential): Promise<UserAuthentication>;
}
