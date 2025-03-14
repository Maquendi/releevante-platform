import { ApiRequest, ApiResponse } from "./model";
import { buildRequestUrl, buildHttpHeaders } from "./utils";

export const executePost = async <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders(request) as any;

  const body = request.body;

  const data = await fetch(requestUrl, {
    method: "post",
    headers,
    body: JSON.stringify(body),
  });
  return (await data.json()) as ApiResponse<T>;
};

export const executeGet = async function <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders(request) as any;

  const data = await fetch(requestUrl, {
    method: "get",
    headers,
  });

  return (await data?.json()) as ApiResponse<T>;
};


export const executePatch = async function <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders(request) as any;

  const data = await fetch(requestUrl, {
    method: "patch",
    headers,
  });

  return (await data?.json()) as ApiResponse<T>;
};

export const executePut = async <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders(request) as any;

  const body = request.body as any;

  const response = await fetch(requestUrl, {
    method: "put",
    headers,
    body: JSON.stringify(body),
  });
  return (await response.json()) as ApiResponse<T>;
};
