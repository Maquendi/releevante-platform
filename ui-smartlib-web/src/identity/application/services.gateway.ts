import { AppHttpClient } from "@/lib/http/model";
import { AuthCredential, UserAuthentication, UserAuthResponse } from "./dto";
import { UserServices } from "./services";
import { DefaultAppHttpClient } from "@/lib/http/default-app-http-client";

export interface UserServiceGateway extends UserServices {}

class UserServiceGatewayImpl implements UserServiceGateway {
  constructor(private httpClient: AppHttpClient) {}

  async authenticate(credential: AuthCredential): Promise<UserAuthentication> {
    const request = {
      resource: "/users/auth/pin-login",
      body: {
        credential: credential.value,
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
      },
    };
  }
}

export const userServiceGateway = new UserServiceGatewayImpl(
  new DefaultAppHttpClient()
);
