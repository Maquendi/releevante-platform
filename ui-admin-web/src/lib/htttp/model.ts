export interface ApiRequest {
  resource: string;
  token?: string;
  body?: object;
  queryParams?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  statusCode: number;
  context: {
    data: T;
  };
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FetchOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

export interface TokenPayload {
  aud: string;
  org: string;
  roles: string[];
  sub: string;
  exp: number;
}

export const buildRequest = async (
  resource: string,
  request: any
): Promise<ApiRequest> => {
  return {
    resource: resource,
    body: request,
  };
};
