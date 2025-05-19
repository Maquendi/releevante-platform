import { extractPayload } from "./jwt-parser";
import { AppSession } from "./model";
import { authenticateUser } from "./service";


class IdentityServiceFacade {

    constructor() { }

    async doLogin(username: string, password: string): Promise<AppSession> {
        return authenticateUser({ username, password })
            .then(response => {
                const jwtPayload = extractPayload(response.context.data.token)
                return {
                    token: response.context.data.token,
                    expiresAt: jwtPayload.expiresAt,
                    user: {
                        fullName: response.context.data.fullName,
                        id: response.context.data.userId,
                        org: response.context.data.org,
                        orgId: response.context.data.orgId,
                        account: {
                            username,
                            email: response.context.data.email,
                            phone: response.context.data.phone,
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