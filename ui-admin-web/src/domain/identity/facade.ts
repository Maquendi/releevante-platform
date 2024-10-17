import { extractPayload } from "./jwt-parser";
import { AppSession } from "./model";
import { authenticateUser } from "./service";


class IdentityServiceFacade {

    constructor() { }

    async doLogin(username: string, password: string): Promise<AppSession> {
        return authenticateUser({ username, password })
            .then(response => {
                const jwtPayload = extractPayload(response.data.token)
                return {
                    token: response.data.token,
                    expiresAt: jwtPayload.expiresAt,
                    user: {
                        fullName: response.data.fullName,
                        id: response.data.userId,
                        org: response.data.org,
                        orgId: response.data.orgId,
                        account: {
                            username,
                            email: response.data.email,
                            phone: response.data.phone,
                            role: {
                                name: jwtPayload.role,
                                permissions: jwtPayload.permissions
                            }
                        }
                    }
                }
            });
    }
}


export const identityService = new IdentityServiceFacade();