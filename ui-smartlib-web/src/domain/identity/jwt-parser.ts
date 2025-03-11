import jwt from "jsonwebtoken";
import fs from "fs";
import { cookies } from "next/headers";

export interface JwtPayload {
  token: string;
  userId: string;
  accountId: string;
  org: string;
  orgId: string;
  cartId: string;
}

const privateKey = fs.readFileSync("../private.pem", "utf8");
const publicKey = fs.readFileSync("../public.pem", "utf8");

export function signToken<T extends object>(payload: T) {
  try {
    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
  } catch (err) {
    throw err;
  }
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    return decoded as JwtPayload;
  } catch (err) {
    throw err;
  }
}

export async function getUserSeccion(): Promise<
  JwtPayload | null
> {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get(process.env.AUTH_COOKIE!)?.value;

    if (!userToken) return null;

    const decoded = verifyToken(userToken!);
    if (!decoded.userId) {
      return null
    }

    return decoded;
  } catch  {
    return null
  }
}
