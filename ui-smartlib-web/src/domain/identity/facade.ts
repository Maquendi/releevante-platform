import { dbGetOne } from "@/lib/drizzle-client";
import { authenticateUserApi } from "./authApiService";
import { cookies } from "next/headers";
import { authenticateUserDb, createUserLocalDb } from "./localDbService";

const AUTH_COOKIE=process.env.AUTH_COOKIE as string

class IdentityServiceFacade {
  constructor() {}

  async doLogin(passcode: string) {
    const seccionLocalDb = await authenticateUserDb({ passcode });

    if (seccionLocalDb?.userId) {
      cookies().set(AUTH_COOKIE, seccionLocalDb.token!, {
        httpOnly: true,
      });
      return;
    }

    const apiSeccion = await authenticateUserApi({ passcode });

    if (apiSeccion.statusCode === 200) {
      cookies().set(AUTH_COOKIE, apiSeccion.data.token!, {
        httpOnly: true,
      });
      const organization = await dbGetOne('organization')
      if(!organization){
        throw new Error('Organization not found')
      }
      createUserLocalDb({ passcode,organization_id:organization.id});
    }
  }
}

export const identityService = new IdentityServiceFacade();
