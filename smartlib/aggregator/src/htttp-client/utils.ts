import { ApiRequest } from "./model";
import { getTraceId } from '../logger';

//const AUTH_API_KEY = process.env.API_KEY;

export function buildRequestUrl(request: ApiRequest) {
  let resourceUrl = `${request.resource}`;
  request.queryParams?.entries().map((key, value) => {
    resourceUrl = `${resourceUrl}/?${key}=${value}`;
  });

  const API_SERVER_URL = `${process.env.SERVER_URL}/api`;
  return `${API_SERVER_URL}/${resourceUrl}`;
}

export function buildHttpHeaders(request: ApiRequest) {
  // Get the current trace ID or use the one from the request
  const traceId = getTraceId() || '';
  if (request.token) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${request.token}`,
      "X-Trace-Id": traceId,
    };
  }

  return {
    "Content-Type": "application/json",
    "X-Trace-Id": traceId,
  };
}
