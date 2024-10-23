import { authenticateUserApi } from "./authApiService";
import { getUser, createUserLocalDb } from "./localDbService";
import { signToken } from "./jwt-parser";

class IdentityServiceFacade {
  constructor() {}

  async doLogin(passcode: string): Promise<{ token: string }> {
    const dbUser = await getUser({ passcode });

    if (dbUser?.id) {
      const token = signToken({
        sub: dbUser.id,
        org: dbUser.orgId,
      });
      return { token };
    }

    const response = await authenticateUserApi({ passcode });

    if (response?.statusCode === 200) {
      await createUserLocalDb({
        passcode,
        organization_id: response.data?.orgId,
      });
      return { token: response.data?.token };
    }

    throw new Error("Login failed");
  }
}

export const identityService = new IdentityServiceFacade();
