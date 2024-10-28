import { AuthCredential, UserAuthentication } from "./dto";

export interface UserServices {
    authenticate(credential: AuthCredential): Promise<UserAuthentication>;
  }
  