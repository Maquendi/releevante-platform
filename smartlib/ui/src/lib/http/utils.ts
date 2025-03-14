import { cookies } from "next/headers";
import { ApiRequest } from "./model";

const API_SERVER_URL = `${process.env.SERVER_URL}/api`;

const AUTH_COOKIE = process.env.AUTH_COOKIE;
const AUTH_API_KEY = process.env.API_KEY;

export function buildRequestUrl(request: ApiRequest) {
  let resourceUrl = `${request.resource}`;
  request.queryParams?.entries().map((key, value) => {
    resourceUrl = `${resourceUrl}/?${key}=${value}`;
  });
  return `${API_SERVER_URL}/${resourceUrl}`;
}

export function buildHttpHeaders() {
  const auth_cookie = cookies().get(AUTH_COOKIE as string);
  return {
    "Content-Type": "application/json",
    authorization: `bearer ${auth_cookie}`,
    apiKey: AUTH_API_KEY,
  } as HeadersInit;
}
