import { ApiRequest, ApiResponse } from "./model";
import { buildRequestUrl, buildHttpHeaders } from "./utils";
//import fetch from "node-fetch";
export const executePost = async<T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders() as any;

  const body = request.body as any;

  const data = await fetch(requestUrl, {
    method: "post",
    headers,
    body,
  });
  return (await data.json()) as ApiResponse<any>;
};

export const executeGet = async function<T>(
  request: ApiRequest
): Promise<ApiResponse<T>> {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders() as any;

  const data = await fetch(requestUrl, {
    method: "get",
    headers,
  });

  return (await data.json()) as ApiResponse<any>;
};

export const executePut = async<T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => {
  const requestUrl = buildRequestUrl(request);

  const headers = buildHttpHeaders() as any;

  const body = request.body as any;

  const response = await fetch(requestUrl, {
    method: "put",
    headers,
    body,
  });
  return (await response.json()) as ApiResponse<any>;
};
