import { ApiRequest } from "./model";
import { cookies } from "next/headers";
const API_SERVER_URL = `${process.env.SERVER_URL}/api`;

const AUTH_COOKIE = process.env.AUTH_COOKIE;
const AUTH_API_KEY = process.env.API_KEY;

function buildRequestUrl(request: ApiRequest) {
  let resourceUrl = `${request.resource}`;
  request.queryParams?.entries().map((key, value) => {
    resourceUrl = `${resourceUrl}/?${key}=${value}`;
  });
  return `${API_SERVER_URL}/${resourceUrl}`;
}

function buildHttpHeaders() {
  const auth_cookie = cookies().get(AUTH_COOKIE as string);
  return {
    "Content-Type": "application/json",
    authorization: `bearer ${auth_cookie}`,
    apiKey: AUTH_API_KEY,
  };
}

export async function executeGet<T>(request: ApiRequest): Promise<T> {
  const requestUrl = buildRequestUrl(request);
  const headers = buildHttpHeaders() as any;
  return fetch(requestUrl, { headers }).then();
}

export async function executePost<T>(request: ApiRequest): Promise<T> {
  const requestUrl = buildRequestUrl(request);
  const headers = buildHttpHeaders() as any;
  return fetch(requestUrl, { headers }).then();
}

export async function executePut<T>(request: ApiRequest): Promise<T> {
  const requestUrl = buildRequestUrl(request);
  const headers = buildHttpHeaders() as any;
  return fetch(requestUrl, { headers }).then();
}

export async function executePatch<T>(request: ApiRequest): Promise<T> {
  const requestUrl = buildRequestUrl(request);
  const headers = buildHttpHeaders() as any;
  return fetch(requestUrl, { headers }).then();
}
