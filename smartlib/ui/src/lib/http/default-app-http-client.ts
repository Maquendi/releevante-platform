
import { ApiRequest, ApiResponse, AppHttpClient } from "./model";
import { buildHttpHeaders, buildRequestUrl } from "./utils";

export class DefaultAppHttpClient implements AppHttpClient {
  async executeGet<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const requestUrl = buildRequestUrl(request);

    const headers = buildHttpHeaders();

    return fetch(requestUrl, { headers }).then();
  }

  async executePost<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const requestUrl = buildRequestUrl(request);

    const headers = buildHttpHeaders();

    return fetch(requestUrl, { headers }).then();
  }

  async executePut<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const requestUrl = buildRequestUrl(request);

    const headers = buildHttpHeaders();

    return fetch(requestUrl, { headers }).then();
  }

  async executePatch<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const requestUrl = buildRequestUrl(request);

    const headers = buildHttpHeaders();

    return fetch(requestUrl, { headers }).then();
  }
}
