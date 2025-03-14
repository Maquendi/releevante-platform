import { ApiRequest, ApiResponse, FetchOptions, HttpMethod } from "./model";
import { retrieveToken } from "./token-helper";
import { buildRequestUrl, buildHttpHeaders } from "./utils";


const METHODS_WITH_BODY: HttpMethod[] = ["POST" , "PUT" , "PATCH"];

async function prepareRequest<T>(
  request: ApiRequest,
  method: HttpMethod
): Promise<ApiResponse<T>> {
  const token = await retrieveToken();
  const requestUrl = buildRequestUrl(request);
  const headers = buildHttpHeaders({...request,token});
  const options: FetchOptions = {
    method,
    headers,
  };

  if (METHODS_WITH_BODY.includes(method) && request.body) {
    options.body = JSON.stringify(request.body);
  }

  return await fetchHelper<T>(requestUrl, options);
}

export async function fetchHelper<T>(
  requestUrl: string,
  options: FetchOptions
): Promise<ApiResponse<T>> {

  try {
    const response = await fetch(requestUrl, options);
    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch (parseError) {
        try {
          errorBody = await response.text();
        } catch (textError) {
          errorBody = "No se pudo obtener el cuerpo de la respuesta";
        }
      }
      
      throw new Error(
        `Error con la solicitud a ${requestUrl}, status: ${response.status}, error: ${JSON.stringify(errorBody)}`
      );
    }
    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    throw error;
  }
}

export const executeGet = <T>(request: ApiRequest): Promise<ApiResponse<T>> =>
  prepareRequest<T>(request, 'GET');

export const executePost = <T>(request: ApiRequest): Promise<ApiResponse<T>> =>
  prepareRequest<T>(request, "POST");

export const executePut = <T>(request: ApiRequest): Promise<ApiResponse<T>> =>
  prepareRequest<T>(request, "PUT");

export const executePatch = <T>(request: ApiRequest): Promise<ApiResponse<T>> =>
  prepareRequest<T>(request, "PATCH");

export const executeDelete = <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => prepareRequest<T>(request, "DELETE");
