export interface JwtPayload {
    role: string;
    permissions: string[];
    expiresAt: Date
}


export function extractPayload(jwt: string):JwtPayload {
    return {
        role: jwt,
        permissions: [],
        expiresAt: new Date(),
    }
}