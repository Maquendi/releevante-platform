import jwt from "jsonwebtoken";
import fs from "fs";
export interface JwtPayload {
  sub: string;
  iat: number;
}

const privatePemFilePath = process.env.PRIVATE_PEM_FILE_PATH || "";
const publicPemFilePath = process.env.PUBLIC_PEM_FILE_PATH || "";

export function extractPayload(token: string): JwtPayload {
  try {
    const publicKey = fs.readFileSync(publicPemFilePath, "utf8");
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    return decoded as JwtPayload;
  } catch (err) {
    throw new Error("Token inválido o no decodificable");
  }
}

export function signToken<T extends object>(payload: T) {
  try {
    const privateKey = fs.readFileSync(privatePemFilePath, "utf8");
    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
  } catch (err) {
    throw err;
  }
}

export function verifyToken(token: string) {
  try {
    const publicKey = fs.readFileSync(publicPemFilePath, "utf8");
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (err) {
    throw err;
  }
}
