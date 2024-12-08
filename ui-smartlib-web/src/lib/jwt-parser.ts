import jwt from "jsonwebtoken";
import fs from "fs";

export interface JwtPayload {
  role: string;
  permissions: string[];
  expiresAt: Date;
}

const privatePemFilePath = process.env.PRIVATE_PEM_FILE_PATH || "";
const pulicPemFilePath = process.env.PUBLIC_PEM_FILE_PATH || "";
const privateKey = fs.readFileSync(privatePemFilePath, "utf8");
const publicKey = fs.readFileSync(pulicPemFilePath, "utf8");

export function extractPayload(jwt: string): JwtPayload {
  return {
    role: jwt,
    permissions: [],
    expiresAt: new Date(),
  };
}

export function signToken<T extends object>(payload: T) {
  try {
    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
  } catch (err) {
    throw err;
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (err) {
    throw err;
  }
}
