import jwt from "jsonwebtoken";
import { ApiRequest, TokenPayload } from "./model";
import { getCookie } from "../cookies";

export const API_CONFIG = {
  BASE_URL: `${process.env.SERVER_URL}/api`,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
  CLIENT_TOKEN:process.env.CLIENT_TOKEN,
  ACCESS_ID:process.env.ACCESS_ID,
  CLIENT_ID:process.env.CLIENT_ID,
};

export const API_COOKIE = {
  CLIENT_TOKEN:()=>getCookie(API_CONFIG.CLIENT_TOKEN!),
  ACCESS_ID:()=>getCookie(API_CONFIG.ACCESS_ID!),
  CLIENT_PAYLOAD:()=>{
    const client_cookie = getCookie(API_CONFIG.CLIENT_TOKEN!)?.value
    const payload = client_cookie ? extractPayload(client_cookie!):null;
    return payload ? payload : null
  },
  CLIENT_ACCESS_ID:()=>{
    const client_cookie = getCookie(API_CONFIG.CLIENT_TOKEN!)?.value;

    const access_id = getCookie(API_CONFIG.ACCESS_ID!)?.value
    if(access_id)return access_id
    const payload = client_cookie ? extractPayload(client_cookie!):null;
    return payload ? payload?.sub : null
  }
};

export function buildHttpHeaders(request: ApiRequest): Record<string, string> {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };

  if (request.token) {
    headers["Authorization"] = `Bearer ${request.token}`;
  }

  if (request.headers) {
    Object.assign(headers, request.headers);
  }

  return headers;
}

export function buildRequestUrl(request: ApiRequest): string {
  let resourceUrl = request.resource;
  
  if (request.queryParams && Object.keys(request.queryParams).length > 0) {
    const queryString = Object.entries(request.queryParams)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
  
    resourceUrl = `${resourceUrl}?${queryString}`;
  }
  
  return `${API_CONFIG.BASE_URL}${resourceUrl}`;
}

export function extractPayload(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === "object") {
      return decoded as TokenPayload;
    }
    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = extractPayload(token);
  if (!payload) return false;

  const bufferTime = 5 * 60 * 1000;
  const expInMillis = payload.exp * 1000; 
  return expInMillis >= Date.now() + bufferTime;
}