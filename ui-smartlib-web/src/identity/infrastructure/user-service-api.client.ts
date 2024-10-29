import { AppHttpClient } from "@/lib/http/model";
import {
  AuthCredential,
  UserAuthentication,
  UserAuthResponse,
} from "../application/dto";
import { UserServiceApiClient } from "../application/services.definitions";

export class UserServiceApiClientImpl implements UserServiceApiClient {
  constructor(private httpClient: AppHttpClient) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    const request = {
      resource: "/users/auth/pin",
      body: {
        accessCode: credential.value,
      },
    };

    const { data } = await this.httpClient.executePost<UserAuthResponse>(
      request
    );

    return {
      token: data.token,
      user: {
        id: data.userId,
        org: data.orgId,
        hash: data.hash,
      },
    };
  }
}
